import mongoose from "mongoose";

const producerMaterialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["raw", "semi-finished"], default: "raw" },
    description: { type: String },
    supplierRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
    },
    availableQuantity: { type: Number, default: 0 },
    unit: { type: String, default: "kg" },
    pricePerUnit: { type: Number, default: 0 },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producer",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ProducerMaterial", producerMaterialSchema);
