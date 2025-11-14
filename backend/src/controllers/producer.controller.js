import Producers from "../models/Producers.js";
import Role from "../models/Role.js";
import User from "../models/User.js";


// ➕ Add Producer
export const addProducer = async (req, res) => {
  try {
    const producer = await Producers.create(req.body);

    const role = await Role.findOne({ name: "Producer" });
    await User.create({
      userName: producer.email.split("@")[0],
      name: producer.contactPerson,
      email: producer.email,
      password: 123456, // or send via email
      role: role._id,
      profileId: producer._id,
      profileType: "Producer",
    });

    return res.status(201).json({ success: true, data: producer });
  } catch (error) {
    console.error("Error adding producer:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✏️ Update Producer
export const updateProducer = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = { ...req.body };

    // ❌ Prevent updating email or username
    if (updateData.email) delete updateData.email;
    if (updateData.userName) delete updateData.userName;


    const producer = await Producers.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!producer)
      return res.status(404).json({ success: false, message: "Producer not found" });

    await User.findOneAndUpdate(
      { profileId: producer._id, profileType: "Producer" },
      {
        name: producer.contactPerson,
        isActive: producer.status === "active",
      }
    );


    return res.json({ success: true, data: producer });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 📋 Get All Producers (pagination, search, filter)
export const getAllProducers = async (req, res) => {
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

    const [producers, total] = await Promise.all([
      Producers.find(filter)
        .populate("rawMaterialsUsed.supplier", "companyName")
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit)),
      Producers.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: producers,
    });
  } catch (error) {
    console.error("Error fetching producers:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 📄 Get Producer By ID
export const getProducerById = async (req, res) => {
  try {
    const producer = await Producers.findById(req.params.id).populate(
      "rawMaterialsUsed.supplier",
      "companyName"
    );
    if (!producer || producer.isDeleted)
      return res.status(404).json({ success: false, message: "Producer not found" });

    return res.json({ success: true, data: producer });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 🗑️ Soft Delete Producer
export const deleteProducer = async (req, res) => {
  try {
    const producer = await Producers.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!producer)
      return res.status(404).json({ success: false, message: "Producer not found" });

    return res.json({ success: true, message: "Producer deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Verify Producer
export const verifyProducer = async (req, res) => {
  try {
    const { id } = req.params;
    const { verified = true } = req.body;

    const producer = await Producers.findByIdAndUpdate(
      id,
      { verified },
      { new: true }
    );

    if (!producer)
      return res.status(404).json({ success: false, message: "Producer not found" });

    return res.json({
      success: true,
      data: producer,
      message: "Producer verified successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
