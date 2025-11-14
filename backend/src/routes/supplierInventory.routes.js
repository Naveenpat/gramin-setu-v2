import express from "express";
import { addInventory, deleteInventory, getInventory, getInventoryById, getLowStockItems, updateInventory } from "../controllers/supplierInventory.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Add new inventory item
router.post("/", authenticate, addInventory);

// Get all inventory for supplier
router.get("/inventory", authenticate, getInventory);

// Get single inventory item
router.get("/:id", authenticate, getInventoryById);

// Update stock
router.put("/:id", authenticate, updateInventory);

// Delete inventory item
router.delete("/:id", authenticate, deleteInventory);

// Get low stock alerts
router.get("/low/alerts", authenticate, getLowStockItems);

export default router;
