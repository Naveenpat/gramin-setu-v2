import express from "express";
import {
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerById,
  getAllCustomers,
} from "../controllers/customer.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes are protected by authMiddleware
router.use(authenticate);

router.post("/", createCustomer);           // Create customer
router.put("/:id", updateCustomer);        // Update customer
router.delete("/:id", deleteCustomer);     // Delete customer
router.get("/:id", getCustomerById);      // Get single customer
router.get("/", getAllCustomers);         // Get all customers with pagination/search

export default router;
