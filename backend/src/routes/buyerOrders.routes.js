import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { createBuyerOrder, deleteBuyerOrder, getAllBuyerOrders, getBuyerOrderById, updateBuyerOrderStatus } from "../controllers/buyerOrders.controller.js";

const router = express.Router();

router.post("/",authenticate, createBuyerOrder);
router.get("/",authenticate, getAllBuyerOrders);
router.get("/:id",authenticate, getBuyerOrderById);
router.put("/:id/status",authenticate, updateBuyerOrderStatus);
router.delete("/:id",authenticate, deleteBuyerOrder);

export default router;
