import SupplierInventory from "../models/SupplierInventory.js";

export const addInventory = async (req, res) => {
  try {
    const { rawMaterial, totalQuantity, unit, threshold } = req.body;
    const supplier = req.user._id;

    const newItem = await SupplierInventory.create({
      supplier,
      rawMaterial,
      totalQuantity,
      availableQuantity: totalQuantity,
      unit,
      threshold
    });

    res.status(201).json({ success: true, message: "Inventory item added", item: newItem });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add inventory", error: error.message });
  }
};

export const getInventory = async (req, res) => {
  try {
    const supplier = req.user._id;
    const inventory = await SupplierInventory.find({ supplier })
      .populate("rawMaterial", "name category images");

    res.json({ success: true, inventory });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch inventory" });
  }
};

export const getInventoryById = async (req, res) => {
  try {
    const item = await SupplierInventory.findById(req.params.id)
      .populate("rawMaterial", "name category");

    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get item" });
  }
};

export const updateInventory = async (req, res) => {
  try {
    const updatedItem = await SupplierInventory.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    res.json({ success: true, message: "Inventory updated", item: updatedItem });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update inventory" });
  }
};

export const deleteInventory = async (req, res) => {
  try {
    await SupplierInventory.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Inventory item deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete inventory" });
  }
};

export const getLowStockItems = async (req, res) => {
  try {
    const supplier = req.user._id;
    const lowStockItems = await SupplierInventory.find({
      supplier,
      $expr: { $lte: ["$availableQuantity", "$threshold"] }
    }).populate("rawMaterial", "name category");

    res.json({ success: true, count: lowStockItems.length, lowStockItems });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch low stock alerts" });
  }
};
