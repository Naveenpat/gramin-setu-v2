import mongoose from "mongoose";

const rawMaterialSchema = new mongoose.Schema(
  {
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Material name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Fiber", "Wood", "Clay", "Metal", "Textile", "Other"],
    },
    unit: {
      type: String,
      required: true,
      enum: ["Kg", "Gram", "Meter", "Piece", "Litre", "Bundle"],
    },
    pricePerUnit: {
      type: Number,
      required: [true, "Price per unit is required"],
      min: 1,
    },
    minOrderQty: {
      type: Number,
      default: 1,
    },
    stockQty: {
      type: Number,
      required: [true, "Stock quantity is required"],
    },
    leadTimeDays: {
      type: Number,
      default: 2,
    },
    images: [{ type: String }],
    description: { type: String, trim: true },
    returnPolicy: {
      allowed: { type: Boolean, default: false },
      days: { type: Number, default: 0 },
      details: { type: String, trim: true },
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "live", "blocked"],
      default: "pending",
    },
    hsnCode: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("RawMaterial", rawMaterialSchema);
