import Order from "../models/Order.js";

/* =========================================================
   🟢 Create New Order  →  Buyer only
========================================================= */
export const createOrder = async (req, res) => {
  try {
    const { buyer, producer, supplier, items, orderType, notes, paymentMethod } = req.body;

    if (!buyer || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Buyer and items are required" });
    }

    const totalAmount = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    const orderNumber = `ORD-${Date.now()}`;

    const newOrder = await Order.create({
      orderNumber,
      buyer,
      producer,
      supplier,
      items: items.map(i => ({
        ...i,
        subtotal: i.quantity * i.unitPrice,
      })),
      totalAmount,
      orderType: orderType || "product",
      notes: notes || "",
      paymentMethod: paymentMethod || "cash",
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ success: false, message: "Failed to create order", error: error.message });
  }
};

/* =========================================================
   📦 Get All Orders  → Admin only
========================================================= */
export const getAllOrders = async (req, res) => {
  try {
    const { status, buyer } = req.query;

    const query = { isDeleted: false };
    if (status) query.status = status;
    if (buyer) query.buyer = buyer;

    const orders = await Order.find(query)
      .populate("buyer", "fullName email")
      .populate("producer", "companyName")
      .populate("supplier", "companyName")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error("❌ Error fetching all orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

/* =========================================================
   👤 Get Orders by Buyer
========================================================= */
export const getBuyerOrders = async (req, res) => {
  try {
    const buyerId = req.user?._id || req.query.buyer;
    const orders = await Order.find({ buyer: buyerId, isDeleted: false })
      .populate("producer supplier", "companyName")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error("❌ Error fetching buyer orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch buyer orders" });
  }
};

/* =========================================================
   🧱 Get Orders by Supplier
========================================================= */
export const getSupplierOrders = async (req, res) => {
  try {
    const supplierId = req.user?._id || req.query.supplier;
    const orders = await Order.find({ supplier: supplierId, isDeleted: false })
      .populate("buyer", "fullName email")
      .populate("producer", "companyName")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error("❌ Error fetching supplier orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch supplier orders" });
  }
};

/* =========================================================
   🏭 Get Orders by Producer
========================================================= */
export const getProducerOrders = async (req, res) => {
  try {
    const producerId = req.user?._id || req.query.producer;
    const orders = await Order.find({ producer: producerId, isDeleted: false })
      .populate("buyer", "fullName email")
      .populate("supplier", "companyName")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error("❌ Error fetching producer orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch producer orders" });
  }
};

/* =========================================================
   🧑‍💼 Get All Orders (Admin Dashboard)
========================================================= */
export const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find({ isDeleted: false })
      .populate("buyer", "fullName email")
      .populate("producer supplier", "companyName")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error("❌ Error fetching admin orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch admin orders" });
  }
};

/* =========================================================
   🔍 Get Single Order
========================================================= */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("buyer producer supplier");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error("❌ Error fetching order by ID:", error);
    res.status(500).json({ success: false, message: "Failed to get order" });
  }
};

/* =========================================================
   ✏️ Update Order (Admin / Supplier / Producer)
========================================================= */
export const updateOrder = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.items) {
      updates.totalAmount = updates.items.reduce(
        (acc, item) => acc + item.quantity * item.unitPrice,
        0
      );
    }

    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    console.error("❌ Error updating order:", error);
    res.status(500).json({ success: false, message: "Failed to update order" });
  }
};

/* =========================================================
   🗑️ Soft Delete (Admin)
========================================================= */
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.isDeleted = true;
    await order.save();

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting order:", error);
    res.status(500).json({ success: false, message: "Failed to delete order" });
  }
};

/* =========================================================
   🔄 Change Status (Admin / Supplier / Producer)
========================================================= */
export const changeOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "approved",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({ success: true, message: `Order status changed to ${status}`, order });
  } catch (error) {
    console.error("❌ Error changing order status:", error);
    res.status(500).json({ success: false, message: "Failed to change order status" });
  }
};
