import RawMaterial from "../models/RawMaterial.js";

// 🆕 Create
export const createRawMaterial = async (req, res) => {
  try {
    const supplierId = req.user._id; // from authenticate middleware
    const { name, category, unit, pricePerUnit, stockQty, leadTimeDays, hsnCode, description, returnPolicy } = req.body;

    // sirf file names store karne ke liye
    const imageFiles = req.files?.map(file => file.filename) || [];

    const newMaterial = await RawMaterial.create({
      supplierId,
      name,
      category,
      unit,
      pricePerUnit,
      stockQty,
      leadTimeDays,
      hsnCode,
      description,
      returnPolicy,
      images: imageFiles, // only names
    });

    res.status(201).json({
      success: true,
      message: "Raw Material created successfully",
      data: newMaterial,
    });
  } catch (error) {
    console.error("❌ createRawMaterial error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create raw material",
    });
  }
};



// 📜 List for Supplier
export const getSupplierMaterials = async (req, res) => {
  try {
    const materials = await RawMaterial.find({ supplierId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, data: materials });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📄 Get by ID
export const getMaterialById = async (req, res) => {
  try {
    const material = await RawMaterial.findById(req.params.id);
    if (!material) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: material });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✏️ Update
export const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await RawMaterial.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Material not found" });
    }

    const imageFiles = req.files?.map(file => file.filename) || existing.images;

    const updated = await RawMaterial.findByIdAndUpdate(
      id,
      { ...req.body, images: imageFiles },
      { new: true }
    );

    res.json({ success: true, message: "Material updated successfully", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ❌ Delete
export const deleteMaterial = async (req, res) => {
  try {
    const supplierId = req.user._id;
    const { id } = req.params;

    const material = await RawMaterial.findOne({ _id: id, supplierId });
    if (!material)
      return res.status(404).json({ success: false, message: "Unauthorized" });

    await material.deleteOne();
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
