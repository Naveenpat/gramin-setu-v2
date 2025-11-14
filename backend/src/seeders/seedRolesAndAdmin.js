import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Role from "../models/Role.js";
import User from "../models/User.js";

dotenv.config();

// ====== MongoDB Connect ======
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

// ====== Seed Roles & Admin ======
const seed = async () => {
  try {
    // ---- Step 1: Define roles ----
const roles = [
  {
    name: "Admin",
    permissions: [
      "admin_dashboard",
      "manage_users",
      "manage_roles",
      "manage_products",
      "manage_orders",
      "manage_payments",
      "view_reports",
      "view_activity_logs",
      "approve_suppliers",
      "approve_producers",
      "site_settings",
    ],
  },
  {
    name: "Supplier",
    permissions: [
      "supplier_dashboard",
      "add_material",
      "update_material",
      "delete_material",
      "manage_stock",
      "view_orders",
      "accept_order",
      "reject_order",
      "view_payment_status",
      "generate_invoice",
    ],
  },
  {
    name: "Producer",
    permissions: [
      "producer_dashboard",
      "browse_materials",
      "buy_material",
      "add_product",
      "update_product",
      "delete_product",
      "manage_orders",
      "view_payments",
      "view_supplier_list",
      "create_deal_with_supplier",
    ],
  },
  {
    name: "Buyer",
    permissions: [
      "buyer_dashboard",
      "browse_products",
      "filter_products",
      "place_order",
      "cancel_order",
      "track_order",
      "make_payment",
      "view_order_history",
      "rate_product",
      "contact_support",
    ],
  },
];


    console.log("🧩 Checking and creating roles...");
    for (let roleData of roles) {
      await Role.findOneAndUpdate(
        { name: roleData.name },
        { $setOnInsert: roleData },
        { upsert: true, new: true }
      );
      console.log(`✅ Role ready: ${roleData.name}`);
    }

    // ---- Step 2: Create Admin User ----
    const adminEmail = "admin@graminsetu.in";
    const adminRole = await Role.findOne({ name: "Admin" });
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {


      await User.create({
        userName:"Admin-123",
        name: "Super Admin",
        email: adminEmail,
        password: 'Admin@123',
        role: adminRole._id,
        isActive: true,
      });

      console.log(
        `✅ Admin user created:\n   Email: ${adminEmail}\n   Password: Admin@123`
      );
    } else {
      console.log("ℹ️ Admin user already exists — skipping creation");
    }

    console.log("🎉 Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    process.exit(1);
  }
};

// ====== Run Seeder ======
connectDB().then(seed);
