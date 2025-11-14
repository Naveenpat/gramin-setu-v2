import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { upload } from "../middlewares/upload.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, upload.array("images", 6), createProduct);
router.get("/", authenticate, getProducts);
router.get("/:id", authenticate, getProductById);
router.put("/:id", authenticate, upload.array("images", 6), updateProduct);
router.delete("/:id", authenticate, deleteProduct);

export default router;
