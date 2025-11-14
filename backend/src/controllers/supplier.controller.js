import bcrypt from "bcryptjs";
import Role from "../models/Role.js";
import Suppliers from "../models/Suppliers.js";
import User from "../models/User.js";


// ➕ Add Supplier
export const addSupplier = async (req, res) => {
  try {
    const {
      companyName,
      contactPerson,
      companyAddress,
      email,
      phone,
      currency,
      gst,
      paymentTerms,
      incoTerms,
      tempPassword, // supplier ke liye temporary password
    } = req.body;

    // 1️⃣ Check duplicate email (User level)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists as a user" });
    }

    // 2️⃣ Create supplier first
    const supplier = await Suppliers.create({
      companyName,
      contactPerson,
      companyAddress,
      email,
      phone,
      currency,
      gst,
      paymentTerms,
      incoTerms,
    });

    // 3️⃣ Fetch Role (Supplier Role)
    const role = await Role.findOne({name:"Supplier"});
    if (!role) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }


    const user = await User.create({
      userName: email, // or you can make it companyName
      name: contactPerson,
      email,
      password: 123456,
      role: role._id,
      profileId: supplier._id, // 👈 connect supplier
      profileType: "Supplier", // 👈 custom field to identify type
      isActive: true,
    });

    // 5️⃣ Final Response
    return res.status(201).json({
      success: true,
      message: "Supplier and User created successfully",
      data: {
        supplier,
        user: {
          id: user._id,
          email: user.email,
          role: role.name,
        },
      },
    });
  } catch (error) {
    console.error("Error adding supplier:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✏️ Update Supplier
export const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // ❌ Prevent changing email or username
    if (updateData.email) delete updateData.email;
    if (updateData.userName) delete updateData.userName;

    // ✅ Update Supplier details
    const supplier = await Suppliers.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!supplier)
      return res.status(404).json({ success: false, message: "Supplier not found" });

    // 🧩 Optional: Also update the linked user details (like name, phone, status)
    await User.findOneAndUpdate(
      { profileId: supplier._id, profileType: "Supplier" },
      {
        name: supplier.contactPerson,
        isActive: supplier.status === "active",
      }
    );

    return res.json({
      success: true,
      message: "Supplier updated successfully",
      data: supplier,
    });
  } catch (error) {
    console.error("Error updating supplier:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


// 📋 Get All Suppliers (pagination, search, filter, sort)
export const getAllSuppliers = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
      status,
      verified,
    } = req.query;

    const filter = { isDeleted: false };

    if (search) {
      filter.$or = [
        { companyName: { $regex: search, $options: "i" } },
        { contactPerson: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (status) filter.status = status;
    if (verified !== undefined) filter.verified = verified === "true";

    const skip = (page - 1) * limit;
    const sortOptions = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const [suppliers, total] = await Promise.all([
      Suppliers.find(filter)
        .populate("currency", "code")
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit)),
      Suppliers.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: suppliers,
    });
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 📄 Get Supplier By ID
export const getSupplierById = async (req, res) => {
  try {
    const supplier = await Suppliers.findById(req.params.id);
    if (!supplier || supplier.isDeleted)
      return res.status(404).json({ success: false, message: "Supplier not found" });

    return res.json({ success: true, data: supplier });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 🗑️ Soft Delete Supplier
export const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Suppliers.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!supplier)
      return res.status(404).json({ success: false, message: "Supplier not found" });

    return res.json({ success: true, message: "Supplier deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Verify / Approve Supplier
export const verifySupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { verified = true } = req.body;

    const supplier = await Suppliers.findByIdAndUpdate(
      id,
      { verified },
      { new: true }
    );

    if (!supplier)
      return res.status(404).json({ success: false, message: "Supplier not found" });

    return res.json({ success: true, data: supplier, message: "Supplier verified successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
