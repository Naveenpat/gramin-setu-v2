import express from "express";
import { upload } from "../middlewares/upload.js";
import {
  createRawMaterial,
  getSupplierMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
} from "../controllers/rawMaterial.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, upload.array("images", 5), createRawMaterial);
router.get("/", authenticate, getSupplierMaterials);
router.get("/:id", authenticate, getMaterialById);
router.put("/:id", authenticate, upload.array("images", 5), updateMaterial);
router.delete("/:id", authenticate, deleteMaterial);

export default router;
