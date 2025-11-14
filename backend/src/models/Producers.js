import mongoose from "mongoose";

const producerSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    contactPerson: {
      type: String,
      required: [true, "Contact person name is required"],
      trim: true,
    },
    companyAddress: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },
    phone: {
      type: String,
      trim: true,
    },
    gst: {
      type: Boolean,
      default: false,
    },
    paymentTerms: {
      type: String,
      trim: true,
    },
    products: [
      {
        name: { type: String, trim: true },
        category: { type: String, trim: true },
      },
    ],
    rawMaterialsUsed: [
      {
        materialName: { type: String, trim: true },
        supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Producer", producerSchema);
