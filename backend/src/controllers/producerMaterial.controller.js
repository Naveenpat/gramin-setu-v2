import ProducerMaterial from "../models/producerMaterial.js";

export const createProducerMaterial = async (req, res) => {
  
  try {
    req.body.createdBy = req.user.id
    const material = await ProducerMaterial.create(req.body);
    res.status(201).json({ success: true, data: material });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllProducerMaterials = async (req, res) => {
  try {
    const materials = await ProducerMaterial.find().populate("supplierRef");
    res.status(200).json({ success: true, data: materials });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getProducerMaterialById = async (req, res) => {
  try {
    const material = await ProducerMaterial.findById(req.params.id).populate("supplierRef");
    if (!material) return res.status(404).json({ success: false, message: "Material not found" });
    res.status(200).json({ success: true, data: material });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateProducerMaterial = async (req, res) => {
  try {
    const material = await ProducerMaterial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!material) return res.status(404).json({ success: false, message: "Material not found" });
    res.status(200).json({ success: true, data: material });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteProducerMaterial = async (req, res) => {
  try {
    const material = await ProducerMaterial.findByIdAndDelete(req.params.id);
    if (!material) return res.status(404).json({ success: false, message: "Material not found" });
    res.status(200).json({ success: true, message: "Material deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
