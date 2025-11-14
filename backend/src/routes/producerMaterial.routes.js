import express from "express";
import {
  createProducerMaterial,
  getAllProducerMaterials,
  getProducerMaterialById,
  updateProducerMaterial,
  deleteProducerMaterial,
} from "../controllers/producerMaterial.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/",authenticate, createProducerMaterial);
router.get("/",authenticate, getAllProducerMaterials);
router.get("/:id",authenticate, getProducerMaterialById);
router.put("/:id",authenticate, updateProducerMaterial);
router.delete("/:id", authenticate,deleteProducerMaterial);

export default router;
