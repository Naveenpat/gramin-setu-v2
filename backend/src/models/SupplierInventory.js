import mongoose from "mongoose";

const SupplierInventorySchema = new mongoose.Schema({
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rawMaterial: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RawMaterial",
    required: true,
  },
  totalQuantity: {
    type: Number,
    required: true,
  },
  availableQuantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    enum: ["kg", "litre", "piece", "packet"],
    default: "kg",
  },
  threshold: {
    type: Number,
    default: 10, // low stock alert
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default mongoose.model("SupplierInventory", SupplierInventorySchema);
