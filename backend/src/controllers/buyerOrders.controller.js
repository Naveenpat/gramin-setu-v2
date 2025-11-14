import BuyerOrder from "../models/BuyerOrder.js";

// 🟢 Create new buyer order
export const createBuyerOrder = async (req, res) => {
  try {
    const { buyer, producer, items, paymentMethod, notes } = req.body;

    if (!buyer || !producer || !items || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "All required fields missing" });
    }

    const totalAmount = items.reduce(
      (acc, item) => acc + item.quantity * item.unitPrice,
      0
    );

    const orderNumber = `BUY-${Date.now()}`;

    const newOrder = await BuyerOrder.create({
      orderNumber,
      buyer,
      producer,
      items: items.map((i) => ({
        ...i,
        subtotal: i.quantity * i.unitPrice,
      })),
      totalAmount,
      paymentMethod,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating buyer order:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📦 Get all buyer orders
export const getAllBuyerOrders = async (req, res) => {
  try {
    const { buyer } = req.query;

    const query = { isDeleted: false };
    if (buyer) query.buyer = buyer;

    const orders = await BuyerOrder.find(query)
      .populate("buyer", "fullName email")
      .populate("producer", "companyName")
      .populate("items.productId", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error("Error fetching buyer orders:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔍 Get order by ID
export const getBuyerOrderById = async (req, res) => {
  try {
    const order = await BuyerOrder.findById(req.params.id)
      .populate("buyer producer items.productId");

    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✏️ Update status
export const updateBuyerOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ["pending", "accepted", "shipped", "delivered", "cancelled"];
    if (!valid.includes(status))
      return res.status(400).json({ success: false, message: "Invalid status" });

    const order = await BuyerOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });

    res.json({ success: true, message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🗑️ Soft delete order
export const deleteBuyerOrder = async (req, res) => {
  try {
    const order = await BuyerOrder.findById(req.params.id);
    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });

    order.isDeleted = true;
    await order.save();
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
