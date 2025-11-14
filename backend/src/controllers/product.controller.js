import mongoose from "mongoose";
import Product from "../models/Product.js";

// 🟢 Create Product
export const createProduct = async (req, res) => {
  try {
    const producerId = req.user._id;
    const { name, category, sku, materialsUsed, costPrice, sellingPrice, stockQty, description, status } = req.body;

    if (!name || !sellingPrice) {
      return res.status(400).json({ success: false, message: "Name and selling price required" });
    }

    const parsedMaterials =
      typeof materialsUsed === "string" ? JSON.parse(materialsUsed) : materialsUsed || [];

    const images = req.files?.map((f) => f.filename || f.path) || [];

    const product = await Product.create({
      producerId,
      name,
      category,
      sku,
      materialsUsed: parsedMaterials,
      costPrice,
      sellingPrice,
      stockQty,
      images,
      description,
      status: status || "draft",
    });

    res.status(201).json({ success: true, message: "Product created", data: product });
  } catch (err) {
    console.error("createProduct error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📦 Get All Products
export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, status, producerId } = req.query;
    const skip = (page - 1) * limit;
    const query = { isDeleted: false };

    if (req.user.role !== "admin") query.producerId = req.user._id;
    else if (producerId) query.producerId = producerId;

    if (search)
      query.$or = [
        { name: new RegExp(search, "i") },
        { category: new RegExp(search, "i") },
        { sku: new RegExp(search, "i") },
      ];

    if (category) query.category = category;
    if (status) query.status = status;

    const [total, data] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    res.json({ success: true, total, data });
  } catch (err) {
    console.error("getProducts error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔍 Get Single Product
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("materialsUsed.materialId", "name unit");
    if (!product) return res.status(404).json({ success: false, message: "Not found" });

    if (req.user.role !== "admin" && product.producerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✏️ Update Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Not found" });

    if (req.user.role !== "admin" && product.producerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const updates = { ...req.body };
    if (updates.materialsUsed)
      updates.materialsUsed =
        typeof updates.materialsUsed === "string"
          ? JSON.parse(updates.materialsUsed)
          : updates.materialsUsed;

    if (req.files?.length > 0)
      updates.images = req.files.map((f) => f.filename || f.path);

    const updated = await Product.findByIdAndUpdate(id, updates, { new: true });
    res.json({ success: true, message: "Product updated", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🗑️ Soft Delete
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Not found" });

    product.isDeleted = true;
    await product.save();
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
