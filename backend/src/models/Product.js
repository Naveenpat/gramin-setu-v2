import mongoose from "mongoose";

const materialUsedSchema = new mongoose.Schema(
  {
    materialId: { type: mongoose.Schema.Types.ObjectId, ref: "RawMaterial", required: true },
    name: { type: String, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, trim: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    producerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, trim: true, default: "Other" },
    sku: { type: String, unique: true, sparse: true, trim: true },
    materialsUsed: { type: [materialUsedSchema], default: [] },
    costPrice: { type: Number, min: 0, default: 0 },
    sellingPrice: { type: Number, min: 0, required: true },
    stockQty: { type: Number, default: 0, min: 0 },
    images: [{ type: String }],
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ["draft", "pending", "approved", "live", "blocked"],
      default: "draft",
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (!this.sku) {
    this.sku = `PRD-${Date.now().toString().slice(-6)}`;
  }
  next();
});

productSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});

export default mongoose.model("Product", productSchema);
