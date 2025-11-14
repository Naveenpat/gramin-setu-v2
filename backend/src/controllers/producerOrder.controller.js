import ProducerOrder from "../models/producerOrder.js";

// ✅ Create new order
export const createOrder = async (req, res) => {
  try {
    const { producerId, buyerId, products, totalAmount } = req.body;

    const newOrder = await ProducerOrder.create({
      producerId,
      buyerId,
      products,
      totalAmount,
    });

    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await ProducerOrder.find()
      .populate("producerId", "name email")
      .populate("buyerId", "name email")
      .populate("products.productId", "name sellingPrice");

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await ProducerOrder.findById(req.params.id)
      .populate("producerId", "name email")
      .populate("buyerId", "name email")
      .populate("products.productId", "name sellingPrice");

    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    const order = await ProducerOrder.findByIdAndUpdate(
      req.params.id,
      { status, paymentStatus },
      { new: true }
    );

    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete order
export const deleteOrder = async (req, res) => {
  try {
    const order = await ProducerOrder.findByIdAndDelete(req.params.id);

    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
