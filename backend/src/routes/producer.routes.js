import express from "express";
import {
  addProducer,
  deleteProducer,
  getAllProducers,
  getProducerById,
  updateProducer,
  verifyProducer,
} from "../controllers/producer.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 🔒 All routes are protected
router.use(authenticate);

router.post("/", addProducer);
router.get("/", getAllProducers);
router.get("/:id", getProducerById);
router.put("/:id", updateProducer);
router.patch("/:id/verify", verifyProducer);
router.delete("/:id", deleteProducer);

export default router;
