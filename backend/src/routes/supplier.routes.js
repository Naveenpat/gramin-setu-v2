import express from "express";
import {
  addSupplier,
  deleteSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  verifySupplier,
} from "../controllers/supplier.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 🔒 All routes are protected
router.use(authenticate);

router.post("/", addSupplier);
router.get("/", getAllSuppliers);
router.get("/:id", getSupplierById);
router.put("/:id", updateSupplier);
router.patch("/:id/verify", verifySupplier);
router.delete("/:id", deleteSupplier);

export default router;
