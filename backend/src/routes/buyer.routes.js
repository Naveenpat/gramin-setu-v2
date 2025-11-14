import express from "express";
import { createBuyer, deleteBuyer, getAllBuyers, getBuyerById, updateBuyer, verifyBuyer } from "../controllers/buyer.controller.js";

const router = express.Router();

router.post("/", createBuyer);
router.get("/", getAllBuyers);
router.get("/:id", getBuyerById);
router.put("/:id", updateBuyer);
router.delete("/:id", deleteBuyer);
router.patch("/:id/verify", verifyBuyer);

export default router;
