import mongoose from "mongoose";

// ==========================
// Sub Schema for Order Items
// ==========================
const orderItemSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true, trim: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, min: 0, default: 0 }, // auto-calculated
  },
  { _id: false }
);

// ==========================
// Main Order Schema
// ==========================
const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Buyer",
      required: true,
    },

    producer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producer",
      default: null,
    },

    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      default: null,
    },

    items: {
      type: [orderItemSchema],
      validate: [(val) => val.length > 0, "Order must contain at least one item"],
    },

    totalAmount: {
      type: Number,
      min: 0,
      default: 0,
    },

    orderType: {
      type: String,
      enum: ["raw_material", "product", "service"],
      default: "product",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "online", "upi", "bank_transfer"],
      default: "online",
    },

    orderDate: {
      type: Date,
      default: Date.now,
    },

    deliveryDate: {
      type: Date,
      default: null,
    },

    expectedDeliveryDays: {
      type: Number,
      default: 7,
    },

    notes: {
      type: String,
      trim: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// ==========================
// Virtual Fields
// ==========================
orderSchema.virtual("isPaid").get(function () {
  return this.paymentStatus === "paid";
});

// ==========================
// Pre-save Hooks
// ==========================
orderSchema.pre("save", function (next) {
  if (this.items && this.items.length > 0) {
    this.items.forEach((item) => {
      item.subtotal = item.quantity * item.unitPrice;
    });
    this.totalAmount = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  }
  next();
});

// ==========================
// Soft Delete Filter
// ==========================
orderSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});

// ==========================
// Indexes for Fast Querying
// ==========================
orderSchema.index({ buyer: 1, status: 1 });
orderSchema.index({ orderNumber: 1 });

// ==========================
// Model Export
// ==========================
const Order = mongoose.model("Order", orderSchema);
export default Order;
