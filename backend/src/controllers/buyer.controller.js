import Buyers from "../models/Buyers.js";
import Role from "../models/Role.js";
import User from "../models/User.js";


// ➕ Create Buyer
export const createBuyer = async (req, res) => {
  try {
    const buyer = await Buyers.create(req.body);

    const role = await Role.findOne({ name: "Buyer" });
    await User.create({
      userName: buyer.email.split("@")[0],
      name: buyer.fullName,
      email: buyer.email,
      password: 123456, // temporary password
      role: role._id,
      profileId: buyer._id,
      profileType: "Buyer",
    });

    res.status(201).json({ success: true, message: "Buyer added successfully", buyer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📄 Get All Buyers
export const getAllBuyers = async (req, res) => {
  try {
    const buyers = await Buyers.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, buyers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔍 Get Buyer by ID
export const getBuyerById = async (req, res) => {
  try {
    const buyer = await Buyers.findById(req.params.id);
    if (!buyer) return res.status(404).json({ success: false, message: "Buyer not found" });
    res.status(200).json({ success: true, buyer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✏️ Update Buyer
export const updateBuyer = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // ❌ Prevent email or username update
    if (updateData.email) delete updateData.email;
    if (updateData.userName) delete updateData.userName;


    const buyer = await Buyers.findByIdAndUpdate(req.params.id, updateData, { new: true });

    await User.findOneAndUpdate(
      { profileId: buyer._id, profileType: "Buyer" },
      {
        name: buyer.fullName,
        isActive: buyer.status === "active",
      }
    );

    res.status(200).json({ success: true, message: "Buyer updated successfully", buyer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🗑️ Delete Buyer
export const deleteBuyer = async (req, res) => {
  try {
    await Buyers.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Buyer deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Verify Buyer
export const verifyBuyer = async (req, res) => {
  try {
    const buyer = await Buyers.findByIdAndUpdate(
      req.params.id,
      { verified: true },
      { new: true }
    );
    res.status(200).json({ success: true, message: "Buyer verified successfully", buyer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
