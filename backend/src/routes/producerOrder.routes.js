import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/producerOrder.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Routes
router.post("/",authenticate, createOrder);
router.get("/",authenticate, getAllOrders);
router.get("/:id",authenticate, getOrderById);
router.put("/:id",authenticate, updateOrderStatus);
router.delete("/:id",authenticate, deleteOrder);

export default router;
