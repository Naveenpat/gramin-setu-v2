import express from "express";
import { changeOrderStatus, createOrder, deleteOrder, getAdminOrders, getAllOrders, getBuyerOrders, getOrderById, getProducerOrders, getSupplierOrders, updateOrder } from "../controllers/order.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ============================
   🔐 Admin Routes
============================ */
router.get(
  "/admin",
  authenticate,
  authorize("admin"),
  getAdminOrders
);

/* ============================
   👤 Buyer Routes
============================ */
// Create a new order
router.post(
  "/buyer",
  authenticate,
  authorize("buyer"),
  createOrder
);

// Get buyer's own orders
router.get(
  "/buyer",
  authenticate,
  authorize("buyer"),
  getBuyerOrders
);

/* ============================
   🏭 Producer Routes
============================ */
router.get(
  "/producer",
  authenticate,
  authorize("producer"),
  getProducerOrders
);

/* ============================
   🧱 Supplier Routes
============================ */
router.get(
  "/supplier",
  authenticate,
  authorize("supplier"),
  getSupplierOrders
);

/* ============================
   ⚙️ Common CRUD Routes
============================ */

// Get all orders (for admin / reports)
router.get("/", authenticate, authorize("admin"), getAllOrders);

// Get single order by ID (accessible to related users)
router.get("/:id", authenticate, getOrderById);

// Update order details (admin / supplier / producer)
router.put(
  "/:id",
  authenticate,
  authorize("admin", "supplier", "producer"),
  updateOrder
);

// Change order status (admin / supplier / producer)
router.patch(
  "/:id/status",
  authenticate,
  authorize("admin", "supplier", "producer"),
  changeOrderStatus
);

// Soft Delete Order (admin only)
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  deleteOrder
);

export default router;
