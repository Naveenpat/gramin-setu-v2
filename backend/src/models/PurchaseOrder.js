// models/PurchaseOrder.js
import mongoose from "mongoose";

const poItemSchema = new mongoose.Schema({
  materialId: { type: mongoose.Schema.Types.ObjectId, ref: "RawMaterial", required: true },
  name: String,
  quantity: Number,
  unit: String,
  unitPrice: Number,
  subtotal: Number
}, { _id: false });

const purchaseOrderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  producerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [poItemSchema],
  totalAmount: Number,
  status: { type: String, enum: ["pending","confirmed","dispatched","delivered","cancelled"], default: "pending" },
  deliveryAddress: String,
  paymentStatus: { type: String, enum: ["pending","paid","failed"], default: "pending" }
}, { timestamps: true });

export default mongoose.model("PurchaseOrder", purchaseOrderSchema);
