import mongoose from "mongoose";
import XLSX from "xlsx";
import Drawing from "../models/Drwaing.js";
import Project from "../models/Project.js";
import CostingItems from "../models/CostingItem.js";
import { toDateOrNull, toNum, toStr } from "../utils/helpers.js";
import Customer from "../models/Customer.js";
import Currency from "../models/Currency.js";
import Suppliers from "../models/Suppliers.js";
import UOM from "../models/UOM.js";
import Child from "../models/library/Child.js";
import MPN from "../models/library/MPN.js";
import SkillLevelCosting from "../models/SkillLevelCosting.js";
import MarkupParameter from "../models/MarkupParameters.js";

// 🟢 GET ALL DRAWINGS (with pagination, filters, sorting)
// export const getAllDrawings = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 10,
//       search = "",
//       sortBy = "createdAt",
//       sortOrder = "desc",
//       quoteStatus,
//       quoteType,
//       projectId,
//       customerId,
//     } = req.query;

//     const query = {};

//     // 🔍 Search filter
//     if (search) {
//       query.$or = [
//         { drawingNo: { $regex: search, $options: "i" } },
//         { description: { $regex: search, $options: "i" } },
//       ];
//     }

//     // 🎯 Conditional filters
//     if (quoteStatus) query.quoteStatus = quoteStatus;
//     if (quoteType) query.quoteType = quoteType;
//     if (projectId && mongoose.Types.ObjectId.isValid(projectId)) query.projectId = projectId;
//     if (customerId && mongoose.Types.ObjectId.isValid(customerId)) query.customerId = customerId;

//     const sortOptions = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

//     // ⚙️ Fetch data with pagination
//     const drawings = await Drawing.find(query)
//       .populate("projectId", "projectName code")
//       .populate("customerId", "name contactPerson")
//       .populate("lastEditedBy", "name")
//       .sort(sortOptions)
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit))
//       .lean()
//     const total = await Drawing.countDocuments(query);

//     res.status(200).json({
//       success: true,
//       data: drawings,
//       pagination: {
//         currentPage: parseInt(page),
//         totalPages: Math.ceil(total / limit),
//         totalItems: total,
//         itemsPerPage: parseInt(limit),
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching drawings",
//       error: error.message,
//     });
//   }
// };

// export const getAllDrawings = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 10,
//       search = "",
//       sortBy = "createdAt",
//       sortOrder = "desc",
//       quoteStatus,
//       quoteType,
//       projectId,
//       customerId,
//       drawingDate,
//       drawingRange, // optional e.g. 0–50, 51–100 etc.
//     } = req.query;

//     const query = {};

//     // 🔍 Text Search
//     if (search?.trim()) {
//       query.$or = [
//         { drawingNo: { $regex: search, $options: "i" } },
//         { description: { $regex: search, $options: "i" } },
//         { "projectId.projectName": { $regex: search, $options: "i" } },
//         { "customerId.name": { $regex: search, $options: "i" } },
//       ];
//     }

//     // 🎯 Conditional Filters
//     if (quoteStatus) query.quoteStatus = quoteStatus;
//     if (quoteType) query.quoteType = quoteType;

//     if (projectId && mongoose.Types.ObjectId.isValid(projectId)) {
//       query.projectId = projectId;
//     }

//     if (customerId && mongoose.Types.ObjectId.isValid(customerId)) {
//       query.customerId = customerId;
//     }

//     // 📅 Date Range Filter
//     // 📅 Date Filter (apply to createdAt, not drawingDate)
//     if (req.query.drawingDate) {
//       const raw = req.query.drawingDate;
//       let start = null;
//       let end = null;

//       // Try to parse JSON object or array if stringified
//       if (typeof raw === "string") {
//         try {
//           const parsed = JSON.parse(raw);
//           if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
//             // Shape: { $gte: "...", $lte: "..." }
//             if (parsed.$gte) start = new Date(parsed.$gte);
//             if (parsed.$lte) end = new Date(parsed.$lte);
//           } else if (Array.isArray(parsed)) {
//             // Shape: ["start","end"]
//             if (parsed[0]) start = new Date(parsed[0]);
//             if (parsed[1]) end = new Date(parsed[1]);
//           } else if (raw.includes(",")) {
//             // Shape: "start,end"
//             const [s, e] = raw.split(",").map(s => s.trim());
//             if (s) start = new Date(s);
//             if (e) end = new Date(e);
//           } else {
//             // Single date string -> same-day range
//             const d = new Date(raw);
//             if (!isNaN(d)) {
//               start = new Date(d); start.setHours(0, 0, 0, 0);
//               end = new Date(d); end.setHours(23, 59, 59, 999);
//             }
//           }
//         } catch {
//           // Not JSON, maybe single date string or "start,end"
//           if (raw.includes(",")) {
//             const [s, e] = raw.split(",").map(s => s.trim());
//             if (s) start = new Date(s);
//             if (e) end = new Date(e);
//           } else {
//             const d = new Date(raw);
//             if (!isNaN(d)) {
//               start = new Date(d); start.setHours(0, 0, 0, 0);
//               end = new Date(d); end.setHours(23, 59, 59, 999);
//             }
//           }
//         }
//       } else if (Array.isArray(raw)) {
//         // If Express parsed an array already
//         if (raw[0]) start = new Date(raw[0]);
//         if (raw[1]) end = new Date(raw[1]);
//       } else if (typeof raw === "object" && raw !== null) {
//         // If Express parsed an object already
//         if (raw.$gte) start = new Date(raw.$gte);
//         if (raw.$lte) end = new Date(raw.$lte);
//       }

//       // Normalize times for inclusive day bounds
//       if (start && !isNaN(start)) start.setHours(0, 0, 0, 0);
//       if (end && !isNaN(end)) end.setHours(23, 59, 59, 999);

//       // Apply to createdAt
//       if (start && end) query.createdAt = { $gte: start, $lte: end };
//       else if (start) query.createdAt = { $gte: start };
//       else if (end) query.createdAt = { $lte: end };
//     }


//     // 📏 Drawing Range Filter (e.g. 0–50)
//     if (drawingRange) {
//       const [min, max] = drawingRange.split("-").map(Number);
//       if (!isNaN(min) && !isNaN(max)) {
//         query.drawingNo = { $gte: min, $lte: max };
//       }
//     }

//     // ⚙️ Sorting
//     const sortOptions = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

//     // 🚀 Fetch Data with Population + Pagination
//     const drawings = await Drawing.find(query)
//       .populate("projectId", "projectName code")
//       .populate("customerId", "name contactPerson companyName")
//       .populate("lastEditedBy", "name email")
//       .populate("currency", "code symbol")
//       .sort(sortOptions)
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit))
//       .lean();

//     const total = await Drawing.countDocuments(query);

//     // 📦 Response
//     res.status(200).json({
//       success: true,
//       data: drawings,
//       pagination: {
//         currentPage: parseInt(page),
//         totalPages: Math.ceil(total / limit),
//         totalItems: total,
//         itemsPerPage: parseInt(limit),
//       },
//       filtersUsed: query,
//     });
//   } catch (error) {
//     console.error("❌ Error fetching drawings:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching drawings",
//       error: error.message,
//     });
//   }
// };


function round2(n) { return Math.round(Number(n || 0) * 100) / 100; }

export const getAllDrawings = async (req, res) => {
  try {
    let {
      page = 1, limit = 10, search = "", sortBy = "createdAt", sortOrder = "desc",
      quoteStatus, quoteType, projectId, customerId, drawingDate, drawingRange
    } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const query = {};

    if (search?.trim()) {
      query.$or = [
        { drawingNo: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (quoteStatus) query.quoteStatus = quoteStatus;
    if (quoteType) query.quoteType = quoteType;

    if (projectId && mongoose.Types.ObjectId.isValid(projectId)) query.projectId = projectId;
    if (customerId && mongoose.Types.ObjectId.isValid(customerId)) query.customerId = customerId;

    // createdAt date filter (shortened for brevity)
    if (req.query.drawingDate) {
      const d = new Date(req.query.drawingDate);
      if (!isNaN(d)) {
        const start = new Date(d); start.setHours(0, 0, 0, 0);
        const end = new Date(d); end.setHours(23, 59, 59, 999);
        query.createdAt = { $gte: start, $lte: end };
      }
    }

    if (drawingRange) {
      const [min, max] = drawingRange.split('-').map(Number);
      if (!isNaN(min) && !isNaN(max)) query.drawingNo = { $gte: min, $lte: max };
    }

    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // 1) page of drawings
    const drawings = await Drawing.find(query)
      .populate('projectId', 'projectName code')
      .populate('customerId', 'name contactPerson companyName')
      .populate('lastEditedBy', 'name email')
      .populate('currency', 'code symbol')
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Drawing.countDocuments(query);

    // 2) aggregate CostingItems by drawingId + quoteType; sum extPrice (fallback qty*unitPrice)
    // 2) aggregate CostingItems by drawingId; sum salesPrice per quoteType + max leadTime
    const ids = drawings.map(d => d._id);
    let agg = [];
    if (ids.length) {
      agg = await CostingItems.aggregate([
        { $match: { drawingId: { $in: ids } } },
        {
          $group: {
            _id: '$drawingId',
            // sums by quoteType
            materialSum: {
              $sum: { $cond: [{ $eq: [{ $toLower: '$quoteType' }, 'material'] }, '$salesPrice', 0] }
            },
            manhourSum: {
              $sum: { $cond: [{ $eq: [{ $toLower: '$quoteType' }, 'manhour'] }, '$salesPrice', 0] }
            },
            packingSum: {
              $sum: { $cond: [{ $eq: [{ $toLower: '$quoteType' }, 'packing'] }, '$salesPrice', 0] }
            },
            // highest leadTime across ALL items in the drawing
            maxLeadTime: { $max: { $ifNull: ['$leadTime', 0] } }
          }
        }
      ]);
    }

    // 3) make map → { drawingId: { material, manhour, packing, maxLeadTime } }
    const costMap = {};
    for (const row of agg) {
      const dId = String(row._id);
      costMap[dId] = {
        material: Number(row.materialSum || 0),
        manhour: Number(row.manhourSum || 0),
        packing: Number(row.packingSum || 0),
        maxLeadTime: Number(row.maxLeadTime || 0)
      };
    }


    // 4) attach computed summary + final markupPrice
    const enriched = drawings.map(d => {
      const sums = costMap[String(d._id)] || { material: 0, manhour: 0, packing: 0, maxLeadTime: 0 };

      const materialMarkup = Number(d.materialMarkup || 0);
      const manhourMarkup = Number(d.manhourMarkup || 0);
      const packingMarkup = Number(d.packingMarkup || 0);

      const materialWith = sums.material * (1 + materialMarkup / 100);
      const manhourWith = sums.manhour * (1 + manhourMarkup / 100);
      const packingWith = sums.packing * (1 + packingMarkup / 100);

      const markupPrice = materialWith + manhourWith + packingWith;

      return {
        ...d,
        costingSummary: {
          byQuoteType: {
            material: { extTotal: round2(sums.material), markupPercent: materialMarkup, totalWithMarkup: round2(materialWith) },
            manhour: { extTotal: round2(sums.manhour), markupPercent: manhourMarkup, totalWithMarkup: round2(manhourWith) },
            packing: { extTotal: round2(sums.packing), markupPercent: packingMarkup, totalWithMarkup: round2(packingWith) },
          },
          extGrandTotal: round2(sums.material + sums.manhour + sums.packing),
          grandTotalWithMarkup: round2(markupPrice),
          // ✅ NEW: highest leadTime from all costing items in this drawing
          maxLeadTimeFromItems: sums.maxLeadTime,  // e.g., in weeks, same unit as your item.leadTime
        },
        markupPrice: round2(markupPrice),
      };
    });


    // 5) (optional) persist markupPrice cache on drawings
    // const bulkOps = enriched.map(d => ({
    //   updateOne: {
    //     filter: { _id: d._id },
    //     update: { $set: { markupPrice: d.markupPrice } }
    //   }
    // }));
    // if (bulkOps.length) await Drawing.bulkWrite(bulkOps);

    return res.status(200).json({
      success: true,
      data: enriched,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
      filtersUsed: query,
    });
  } catch (error) {
    console.error('❌ Error fetching drawings:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching drawings',
      error: error.message,
    });
  }
};



// 🟢 GET SINGLE DRAWING
export const getDrawingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid drawing ID" });

    const drawing = await Drawing.findById(id)
      .populate("projectId")
      .populate("customerId")
      .populate("lastEditedBy", "name")
      .populate("currency", "code")

    if (!drawing)
      return res.status(404).json({ success: false, message: "Drawing not found" });

    res.status(200).json({ success: true, data: drawing });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching drawing",
      error: error.message,
    });
  }
};

// 🟢 CREATE DRAWING
// export const createDrawing = async (req, res) => {
//   try {
//     const data = req.body;
//     const { drawingNo, qty = 1, unitPrice = 0 } = data;

//     // Prevent duplicates
//     const exists = await Drawing.findOne({ drawingNo });
//     if (exists)
//       return res.status(400).json({ success: false, message: "Drawing number already exists" });


//     if (data.projectId) {
//       const project = await Project.findById(data.projectId).select("customerId");
//       if (!project) {
//         return res.status(400).json({ success: false, message: "Invalid projectId" });
//       }
//       data.customerId = project.customerId;
//     }

//     const totalPrice = qty * unitPrice;
//     const newDrawing = await Drawing.create({ ...data, totalPrice });

//     await newDrawing.populate("projectId", "name code");
//     await newDrawing.populate("customerId", "name contactPerson");

//     res.status(201).json({
//       success: true,
//       message: "Drawing created successfully",
//       data: newDrawing,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error creating drawing",
//       error: error.message,
//     });
//   }
// };

// helper to coerce + clamp (0..100)
const clampPct = (v) => {
  if (v === undefined || v === null || v === '') return undefined;
  const n = Number(v);
  if (Number.isNaN(n)) return undefined;
  return Math.max(0, Math.min(100, n));
};

export const createDrawing = async (req, res) => {
  try {
    const data = { ...req.body };
    const { drawingNo, qty = 1, unitPrice = 0 } = data;

    // 1) Prevent duplicates
    const exists = await Drawing.findOne({ drawingNo }).lean();
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: 'Drawing number already exists' });
    }

    // 2) If projectId given → derive customerId
    if (data.projectId) {
      const project = await Project.findById(data.projectId).select('customerId').lean();
      if (!project) {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid projectId' });
      }
      data.customerId = project.customerId;
    }

    // 3) Pull master markups (latest/active)
    //    adjust the query if you maintain "isActive" or similar flag
    const master = await MarkupParameter
      .findOne({ /* isActive: true */ })
      .sort({ updatedAt: -1 })
      .select('materialsMarkup manhourMarkup packingMarkup')
      .lean();



    // 4) Decide per-drawing markups:
    //    - If client sent it, use client (after clamp)
    //    - Else use master value (if exists)
    const materialMarkup =
      clampPct(data.materialMarkup) ??
      clampPct(master?.materialsMarkup) ??
      0;

    const manhourMarkup =
      clampPct(data.manhourMarkup) ??
      clampPct(master?.manhourMarkup) ??
      0;

    const packingMarkup =
      clampPct(data.packingMarkup) ??
      clampPct(master?.packingMarkup) ??
      0;

    // Assign to payload (overriding null defaults on schema)
    data.materialMarkup = materialMarkup;
    data.manhourMarkup = manhourMarkup;
    data.packingMarkup = packingMarkup;
    data.quotedDate = new Date()
    // 5) Compute initial total (basic)
    const totalPrice = Number(qty) * Number(unitPrice);

    // 6) Create
    const newDrawing = await Drawing.create({ ...data, totalPrice });

    // 7) Populate for response (adjust fields to your schema)
    await newDrawing.populate('projectId', 'name code projectName');
    await newDrawing.populate('customerId', 'name contactPerson companyName');

    return res.status(201).json({
      success: true,
      message: 'Drawing created successfully',
      data: newDrawing,
    });
  } catch (error) {
    console.error('createDrawing error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating drawing',
      error: error.message,
    });
  }
};

// 🟢 UPDATE DRAWING
export const updateDrawing = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const data = req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid drawing ID" });

    const existing = await Drawing.findById(id);
    if (!existing)
      return res.status(404).json({ success: false, message: "Drawing not found" });

    if (data.drawingNo) {
      const duplicate = await Drawing.findOne({
        drawingNo: data.drawingNo,
        _id: { $ne: id },
      });
      if (duplicate)
        return res.status(400).json({ success: false, message: "Drawing number already exists" });
    }


    if (data.projectId) {
      const project = await Project.findById(data.projectId).select("customerId");
      if (!project) {
        return res.status(400).json({ success: false, message: "Invalid projectId" });
      }
      data.customerId = project.customerId;
    }


    // Update total price if qty or unitPrice changes
    const qty = data.qty ?? existing.qty;
    const unitPrice = data.unitPrice ?? existing.unitPrice;
    data.totalPrice = qty * unitPrice;
    data.lastEditedBy = userId;
    const updated = await Drawing.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate("projectId", "name code")
      .populate("customerId", "name contactPerson");

    res.status(200).json({
      success: true,
      message: "Drawing updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating drawing",
      error: error.message,
    });
  }
};

// 🟢 DELETE DRAWING
export const deleteDrawing = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid drawing ID" });

    const deleted = await Drawing.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Drawing not found" });

    res.status(200).json({ success: true, message: "Drawing deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting drawing",
      error: error.message,
    });
  }
};

// 🟢 IMPORT DRAWINGS (from Excel or JSON)
// export const importDrawings = async (req, res) => {
//   try {
//     const { drawingsData } = req.body;
//     if (!Array.isArray(drawingsData))
//       return res.status(400).json({ success: false, message: "Invalid data format" });

//     const results = { success: [], errors: [] };

//     for (const d of drawingsData) {
//       try {
//         const exists = await Drawing.findOne({ drawingNo: d.drawingNo });
//         if (exists) {
//           results.errors.push({ drawingNo: d.drawingNo, error: "Duplicate drawing number" });
//           continue;
//         }

//         const totalPrice = (d.qty || 1) * (d.unitPrice || 0);
//         const drawing = await Drawing.create({ ...d, totalPrice });
//         results.success.push(drawing);
//       } catch (err) {
//         results.errors.push({ drawingNo: d.drawingNo, error: err.message });
//       }
//     }

//     res.status(200).json({
//       success: true,
//       message: `Import complete — ${results.success.length} added, ${results.errors.length} failed.`,
//       data: results,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error importing drawings",
//       error: error.message,
//     });
//   }
// };

// export const importDrawings = async (req, res) => {
//   try {
//     if (!req.file?.path) {
//       return res.status(400).json({ success: false, message: "No file uploaded" });
//     }

//     const name = (req.file.originalname || "").toLowerCase();
//     if (!name.endsWith(".xlsx") && !name.endsWith(".xls")) {
//       return res.status(400).json({ success: false, message: "Only .xlsx / .xls files are supported" });
//     }

//     let workbook;
//     try {
//       workbook = XLSX.readFile(req.file.path);
//     } catch (e) {
//       return res.status(400).json({ success: false, message: "Invalid Excel file", error: e.message });
//     }

//     if (!workbook.SheetNames?.length) {
//       return res.status(400).json({ success: false, message: "Excel has no sheets" });
//     }

//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     if (!sheet) {
//       return res.status(400).json({ success: false, message: "First sheet is missing" });
//     }

//     const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
//     if (!Array.isArray(rows) || rows.length === 0) {
//       return res.status(400).json({ success: false, message: "Sheet is empty" });
//     }

//     // Expected headers (case-insensitive): 
//     // drawingNo, description, projectName, customerName, qty, unitPrice, freightPercent, leadTimeWeeks, quotedDate, currencyCode, quoteStatus, quoteType
//     const results = { success: [], errors: [] };

//     for (let idx = 0; idx < rows.length; idx++) {
//       const r = rows[idx];

//       const drawingNo = toStr(r.drawingNo || r.DrawingNo);
//       const description = toStr(r.description || r.Description);
//       const projectName = toStr(r.projectName || r.ProjectName);
//       const customerName = toStr(r.customerName || r.CustomerName);
//       const currencyCode = toStr(r.currencyCode || r.CurrencyCode || r.currency || r.Currency);
//       const qty = toNum(r.qty ?? r.Qty, 1);
//       const unitPrice = toNum(r.unitPrice ?? r.UnitPrice, 0);
//       const freightPercent = toNum(r.freightPercent ?? r.FreightPercent, 0);
//       const leadTimeWeeks = toNum(r.leadTimeWeeks ?? r.LeadTimeWeeks, 0);
//       const quotedDate = toDateOrNull(r.quotedDate ?? r.QuotedDate);
//       const quoteStatus = toStr(r.quoteStatus || r.QuoteStatus || "active");
//       const quoteType = toStr(r.quoteType || r.QuoteType || "cable_harness");

//       // validations
//       if (!drawingNo) {
//         results.errors.push({ row: idx + 2, drawingNo: "-", error: "drawingNo is required" });
//         continue;
//       }
//       // duplicate drawingNo
//       const exists = await Drawing.findOne({ drawingNo });
//       if (exists) {
//         results.errors.push({ row: idx + 2, drawingNo, error: "Duplicate drawing number" });
//         continue;
//       }
//       if (!projectName) {
//         results.errors.push({ row: idx + 2, drawingNo, error: "projectName is required" });
//         continue;
//       }
//       if (!customerName) {
//         results.errors.push({ row: idx + 2, drawingNo, error: "customerName is required" });
//         continue;
//       }
//       if (!currencyCode) {
//         results.errors.push({ row: idx + 2, drawingNo, error: "currencyCode is required" });
//         continue;
//       }

//       // lookups
//       const [project, customer, currency] = await Promise.all([
//         Project.findOne({ projectName: projectName }),
//         Customer.findOne({ companyName: customerName }),
//         Currency.findOne({ code: currencyCode.toUpperCase() }),
//       ]);

//       if (!project) {
//         results.errors.push({ row: idx + 2, drawingNo, error: `Project not found: ${projectName}` });
//         continue;
//       }
//       if (!customer) {
//         results.errors.push({ row: idx + 2, drawingNo, error: `Customer not found: ${customerName}` });
//         continue;
//       }
//       if (!currency) {
//         results.errors.push({ row: idx + 2, drawingNo, error: `Currency not found: ${currencyCode}` });
//         continue;
//       }

//       // pricing math
//       const materialSubtotal = qty * unitPrice;                         // e.g. 3 * 10 = 30
//       const salePrice = materialSubtotal * (1 + freightPercent / 100);  // includes freight uplift
//       const totalPrice = Number(salePrice.toFixed(2));

//       try {
//         const doc = await Drawing.create({
//           drawingNo,
//           description,
//           projectId: project._id,
//           customerId: customer._id,
//           qty,
//           unitPrice,
//           totalPrice,          // store the freight-adjusted total here
//           freightPercent,
//           leadTimeWeeks,
//           quotedDate,
//           currency: currency._id,
//           quoteStatus,
//           quoteType,
//         });

//         results.success.push({
//           id: doc._id,
//           drawingNo: doc.drawingNo,
//           totalPrice: doc.totalPrice,
//         });
//       } catch (e) {
//         results.errors.push({ row: idx + 2, drawingNo, error: e.message });
//       }
//     }

//     return res.status(200).json({
//       success: true,
//       message: `Import complete — ${results.success.length} added, ${results.errors.length} failed.`,
//       data: results,
//     });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: "Error importing drawings", error: error.message });
//   } finally {
//     // clean up temp upload if present
//     try { if (req.file?.path) fs.unlinkSync(req.file.path); } catch { }
//   }
// };

// export const importDrawings = async (req, res) => {
//   try {
//     if (!req.file?.path) {
//       return res.status(400).json({ success: false, message: "No file uploaded" });
//     }

//     const name = (req.file.originalname || "").toLowerCase();
//     if (!name.endsWith(".xlsx") && !name.endsWith(".xls")) {
//       return res.status(400).json({ success: false, message: "Only .xlsx / .xls files are supported" });
//     }

//     let workbook;
//     try {
//       workbook = XLSX.readFile(req.file.path);
//     } catch (e) {
//       return res.status(400).json({ success: false, message: "Invalid Excel file", error: e.message });
//     }

//     if (!workbook.SheetNames?.length) {
//       return res.status(400).json({ success: false, message: "Excel has no sheets" });
//     }

//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     if (!sheet) {
//       return res.status(400).json({ success: false, message: "First sheet is missing" });
//     }

//     const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
//     if (!Array.isArray(rows) || rows.length === 0) {
//       return res.status(400).json({ success: false, message: "Sheet is empty" });
//     }

//     const results = { success: [], errors: [] };

//     // 🔹 Load latest/active master markups ONCE
//     const master = await MarkupParameter
//       .findOne({ /* isActive: true */ })
//       .sort({ updatedAt: -1 })
//       .select('materialsMarkup manhourMarkup packingMarkup')
//       .lean();

//     const masterMaterial = clampPct(master?.materialsMarkup, 0);
//     const masterManhour = clampPct(master?.manhourMarkup, 0);
//     const masterPacking = clampPct(master?.packingMarkup, 0);

//     // 🔹 Preload unique projects to reduce DB roundtrips
//     const uniqueProjectNames = [
//       ...new Set(rows.map(r => toStr(r.projectName || r.ProjectName)).filter(Boolean))
//     ];
//     const projects = await Project.find({ projectName: { $in: uniqueProjectNames } })
//       .select('projectName customerId currency currencyId')
//       .lean();
//     const projectByName = new Map(projects.map(p => [p.projectName, p]));

//     for (let idx = 0; idx < rows.length; idx++) {
//       const r = rows[idx];

//       const drawingNo = toStr(r.drawingNo || r.DrawingNo);
//       const description = toStr(r.description || r.Description);
//       const projectName = toStr(r.projectName || r.ProjectName);
//       const qty = toNum(r.qty ?? r.Qty, 1);
//       const quoteType = toStr(r.quoteType || r.QuoteType || 'material');

//       if (!drawingNo) {
//         results.errors.push({ row: idx + 2, drawingNo: '-', error: 'drawingNo is required' });
//         continue;
//       }

//       const exists = await Drawing.findOne({ drawingNo }).lean();
//       if (exists) {
//         results.errors.push({ row: idx + 2, drawingNo, error: 'Duplicate drawing number' });
//         continue;
//       }

//       if (!projectName) {
//         results.errors.push({ row: idx + 2, drawingNo, error: 'projectName is required' });
//         continue;
//       }

//       const project = projectByName.get(projectName);
//       if (!project) {
//         results.errors.push({ row: idx + 2, drawingNo, error: `Project not found: ${projectName}` });
//         continue;
//       }

//       const projectId = project._id;
//       const customerId = project.customerId || null;
//       const currency = project.currency || project.currencyId || null;

//       // Optional numeric fields (initially zero; costing items will drive totals)
//       const unitPrice = 0;
//       const totalPrice = 0;

//       // ✅ Apply master markups to per-drawing override fields
//       const materialMarkup = masterMaterial;
//       const manhourMarkup = masterManhour;
//       const packingMarkup = masterPacking;

//       try {
//         const doc = await Drawing.create({
//           drawingNo,
//           description,
//           projectId,
//           customerId,
//           currency,
//           qty,
//           unitPrice,
//           totalPrice,
//           quoteType,
//           quoteStatus: 'active',
//           materialMarkup,
//           manhourMarkup,
//           packingMarkup,
//         });

//         results.success.push({
//           id: doc._id,
//           drawingNo: doc.drawingNo,
//           projectName,
//           materialMarkup: doc.materialMarkup,
//           manhourMarkup: doc.manhourMarkup,
//           packingMarkup: doc.packingMarkup,
//         });
//       } catch (e) {
//         results.errors.push({ row: idx + 2, drawingNo, error: e.message });
//       }
//     }

//     return res.status(200).json({
//       success: true,
//       message: `Import complete — ${results.success.length} added, ${results.errors.length} failed.`,
//       data: results,
//     });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: "Error importing drawings", error: error.message });
//   } finally {
//     try { if (req.file?.path) fs.unlinkSync(req.file.path); } catch { }
//   }
// };

// GET /drawings/template  -> download an Excel template
export const downloadDrawingsTemplate = (_req, res) => {
  // Header row with example values in row 2
  const rows = [
    [
      "drawingNo",
      "description",
      "projectName",
      "customerName",
      "qty",
      "unitPrice",
      "freightPercent",
      "leadTimeWeeks",
      "quotedDate",
      "currencyCode",
      "quoteStatus",
      "quoteType",
    ],
    [
      "Nav-123",
      "Test harness",
      "My Project A",
      "Acme Corp",
      3,
      10,
      10,
      8,
      "2025-10-20",
      "USD",
      "active",
      "cable_harness",
    ],
  ];

  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template");

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", `attachment; filename="drawings_import_template.xlsx"`);
  return res.status(200).send(buf);
};



// 🟢 EXPORT DRAWINGS
export const exportDrawings = async (req, res) => {
  try {
    const { format = "json", quoteStatus, quoteType } = req.query;
    const query = {};
    if (quoteStatus) query.quoteStatus = quoteStatus;
    if (quoteType) query.quoteType = quoteType;

    const drawings = await Drawing.find(query)
      .populate("projectId", "name code")
      .populate("customerId", "name");

    if (format === "csv") {
      const csvData = [
        [
          "Drawing No",
          "Description",
          "Project",
          "Customer",
          "Quantity",
          "Unit Price",
          "Total Price",
          "Lead Time (Weeks)",
          "Quoted Date",
          "Quote Status",
          "Quote Type",
          "Last Edited By",
        ],
        ...drawings.map((d) => [
          d.drawingNo,
          d.description,
          d.projectId?.name || "",
          d.customerId?.name || "",
          d.qty,
          d.unitPrice,
          d.totalPrice,
          d.leadTimeWeeks,
          d.quotedDate ? new Date(d.quotedDate).toISOString().split("T")[0] : "",
          d.quoteStatus,
          d.quoteType || "",
          d.lastEditedBy || "",
        ]),
      ];
      const csvContent = csvData.map((r) => r.join(",")).join("\n");
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=drawings_export.csv");
      return res.send(csvContent);
    }

    res.json(drawings);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error exporting drawings",
      error: error.message,
    });
  }
};

export const duplicateDrawing = async (req, res) => {
  try {
    const { id } = req.params; // Original drawing ID
    const { newDrawingNumber } = req.body; // New drawing number from frontend

    console.log('Duplicating drawing:', id, 'with new number:', newDrawingNumber);

    // 1. Find original drawing
    const originalDrawing = await Drawing.findById(id);

    if (!originalDrawing) {
      return res.status(404).json({
        success: false,
        message: 'Original drawing not found'
      });
    }

    // 2. Create duplicate drawing object
    const duplicateData = {
      ...originalDrawing.toObject(), // Copy all fields
      _id: undefined, // Remove original ID
      drawingNo: newDrawingNumber, // New drawing number
      drawingName: `${originalDrawing.drawingName} - Copy`, // New name
      isDuplicate: true,
      originalDrawingId: id, // Reference to original
      createdAt: new Date(),
      updatedAt: new Date(),
      // Reset some fields if needed
      quoteStatus: 'active',
      lastEditedBy: req.user?._id, // If you have user auth
    };

    // 3. Remove unwanted fields
    delete duplicateData.createdAt;
    delete duplicateData.updatedAt;
    delete duplicateData.__v;

    // 4. Create new drawing
    const duplicatedDrawing = new Drawing(duplicateData);
    await duplicatedDrawing.save();

    // 5. Find all costing items of original drawing
    const originalCostingItems = await CostingItems.find({ drawingId: id });

    console.log(`Found ${originalCostingItems.length} costing items to duplicate`);

    // 6. Duplicate all costing items with new drawing ID
    if (originalCostingItems.length > 0) {
      const duplicateCostingItems = originalCostingItems.map(item => ({
        ...item.toObject(),
        _id: undefined, // Remove original ID
        drawingId: duplicatedDrawing._id, // Set new drawing ID
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      // 7. Insert all duplicated costing items
      await CostingItems.insertMany(duplicateCostingItems);
      console.log(`Duplicated ${duplicateCostingItems.length} costing items`);
    }

    // 8. Send response
    res.status(201).json({
      success: true,
      message: 'Drawing duplicated successfully with all costing items',
      data: {
        drawing: duplicatedDrawing,
        costingItemsCount: originalCostingItems.length
      }
    });

  } catch (error) {
    console.error('Error duplicating drawing:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// 🟢 STATS
export const getDrawingStats = async (req, res) => {
  try {
    const total = await Drawing.countDocuments();
    const byStatus = {
      active: await Drawing.countDocuments({ quoteStatus: "active" }),
      completed: await Drawing.countDocuments({ quoteStatus: "completed" }),
      inactive: await Drawing.countDocuments({ quoteStatus: "inactive" }),
    };

    const byType = await Drawing.aggregate([
      { $group: { _id: "$quoteType", count: { $sum: 1 } } },
    ]);

    const totalValue = await Drawing.aggregate([
      { $group: { _id: null, totalValue: { $sum: "$totalPrice" } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        byStatus,
        byType,
        totalValue: totalValue[0]?.totalValue || 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching statistics",
      error: error.message,
    });
  }
};

export const addCostingItem = async (req, res) => {
  try {
    const { drawingId } = req.params;
    const costingData = { ...req.body, drawingId };

    const drawing = await Drawing.findById(drawingId);
    if (!drawing) return res.status(404).json({ error: "Drawing not found" });

    const newItem = await CostingItems.create(costingData);

    // Recalculate total
    const total = await CostingItems.aggregate([
      { $match: { drawingId: drawing._id } },
      { $group: { _id: null, totalPrice: { $sum: "$extPrice" } } },
    ]);

    console.log('-----total', total)

    drawing.totalPrice = total[0]?.totalPrice || 0;
    await drawing.save();

    res.status(201).json({ success: true, message: "Costing item added", data: newItem });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateCostingItem = async (req, res) => {
  try {
    const { drawingId, itemId } = req.params;
    const item = await CostingItems.findOneAndUpdate(
      { _id: itemId, drawingId },
      {
        ...req.body,
        lastEditedBy: req.user?._id, // 👈 current user ka id store karega
        updatedAt: new Date(),       // optional: manual timestamp
      },
      { new: true }
    );


    if (!item) return res.status(404).json({ error: "Costing item not found" });

    const total = await CostingItems.aggregate([
      { $match: { drawingId: new mongoose.Types.ObjectId(drawingId) } },
      { $group: { _id: null, totalPrice: { $sum: "$extPrice" } } },
    ]);

    await Drawing.findByIdAndUpdate(drawingId, {
      totalPrice: total[0]?.totalPrice || 0,
    });

    res.json({ success: true, message: "Costing item updated", data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


export const deleteCostingItem = async (req, res) => {
  try {
    const { drawingId, itemId } = req.params;

    const deleted = await CostingItems.findOneAndDelete({ _id: itemId, drawingId });
    if (!deleted) return res.status(404).json({ error: "Costing item not found" });

    const total = await CostingItems.aggregate([
      { $match: { drawingId: new mongoose.Types.ObjectId(drawingId) } },
      { $group: { _id: null, totalPrice: { $sum: "$extPrice" } } },
    ]);

    await Drawing.findByIdAndUpdate(drawingId, {
      totalPrice: total[0]?.totalPrice || 0,
    });

    res.json({ success: true, message: "Costing item deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


export const getAllCostingItems = async (req, res) => {
  try {
    const { drawingId } = req.params;

    const drawing = await Drawing.findById(drawingId).populate("lastEditedBy", "name").select("drawingNo description totalPrice");
    if (!drawing) return res.status(404).json({ error: "Drawing not found" });

    const items = await CostingItems.find({ drawingId })
      .populate({
        path: "skillLevel", // parent reference
        populate: [
          { path: "type", select: "name code" },           // populate skill type details
          { path: "currencyType", select: "name symbol" }, // populate currency type details
        ],
      })
      .populate("mpn", "MPN")
      .populate("uom", "code")
      .populate("lastEditedBy", "name")
      .sort({ itemNumber: 1 });

    res.json({
      success: true,
      message: "Costing items fetched successfully",
      data: {
        drawing,
        costingItems: items,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const uomCache = new Map();

const getUomId = async (raw, errorsArr, ctx) => {
  const val = toStr(raw)?.trim();
  if (!val) return null;

  const key = val.toUpperCase();

  // check cache first
  if (uomCache.has(key)) return uomCache.get(key);

  // Try to find by code first
  let doc = await UOM.findOne({ code: new RegExp(`^${val}$`, 'i') })
    .select('_id code name')
    .lean();

  // If not found by code, try by name
  if (!doc) {
    doc = await UOM.findOne({ name: new RegExp(`^${val}$`, 'i') })
      .select('_id code name')
      .lean();
  }

  if (!doc) {
    // record non-fatal error
    errorsArr?.push({
      row: ctx?.rowIndex ?? '-',
      drawingNo: ctx?.drawingNo ?? '-',
      error: `UOM not found: "${val}"`,
    });

    uomCache.set(key, null);
    return null;
  }

  // Cache and return ID
  uomCache.set(key, doc._id);
  return doc._id;
};

export const importCostingItems = async (req, res) => {
  try {
    const { drawingId } = req.params;
    const { quoteType } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    // Read Excel File
    const workbook = XLSX.readFile(file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    // Get last item number
    let lastItem = await CostingItems.findOne({ drawingId, quoteType })
      .sort({ itemNumber: -1 })
      .lean();
    let nextItemNumber = lastItem ? Number(lastItem.itemNumber) + 1 : 1;

    const newItems = [];

    // SWITCH BASED ON QUOTETYPE
    for (const row of rows) {
      let newItem = null;

      // ===============================
      // 1️⃣ PACKING QUOTE LOGIC
      // ===============================
      if (quoteType === "packing") {
        // Read from Excel
        const mpnName = (row["MPN Name"] ?? "").toString().trim();
        const descriptionIn = (row["Description"] ?? row.Description ?? "").toString().trim();
        const uomCode = (row["UOM"] ?? row.UOM ?? "").toString().trim();

        const quantity = Number(row["Quantity"] ?? 0);
        const unitPrice = Number(row["Unit Price"] ?? 0);
        const sgaPercent = Number(row["SGA %"] ?? 0);
        const maxBurden = Number(row["Max Burden %"] ?? 0);
        const freightPercent = Number(row["Freight %"] ?? 0);

        // Basic validations
        if (!mpnName) throw new Error("MPN Name is required");
        if (!uomCode) throw new Error("UOM is required");
        if (!(quantity > 0)) throw new Error("Quantity must be > 0");

        // Lookups
        const mpn = await MPN.findOne({ MPN: mpnName })
          .select("_id Description Manufacturer")
          .lean();
        if (!mpn) throw new Error(`MPN not found: ${mpnName}`);

        const uomDoc = await UOM.findOne({ code: uomCode }).select("_id code").lean();
        if (!uomDoc) throw new Error(`UOM not found: ${uomCode}`);

        // Calculations
        const extPrice = quantity * unitPrice;
        const upliftPct = (sgaPercent + maxBurden + freightPercent) / 100;
        const salesPrice = extPrice * (1 + upliftPct);

        // Round to 2 decimals
        const round2 = (n) => Math.round(Number(n || 0) * 100) / 100;

        newItem = {
          drawingId,
          quoteType, // "packing"
          itemNumber: String(nextItemNumber).padStart(4, "0"),

          // From lookups
          mpn: mpn._id,
          description: descriptionIn || (mpn.Description ?? ""),
          manufacturer: mpn.Manufacturer ?? "",
          uom: uomDoc._id,

          // From Excel
          quantity,
          unitPrice,
          sgaPercent,
          maxBurden,
          freightPercent,

          // Computed
          extPrice: round2(extPrice),
          salesPrice: round2(salesPrice),

          // Optional meta
          moq: 0,
          tolerance: 0,
          actualQty: quantity,
          // rfqDate: new Date(),              // or null if you don't want it
          lastEditedBy: req.user?._id || null,
        };
      }


      // ===============================
      // 2️⃣ MANHOUR QUOTE LOGIC
      // ===============================
      else if (quoteType === "manhour") {
        // Columns expected: Skill Level, Remarks, Quantity
        const skillName = (row["Skill Level"] ?? "").toString().trim();
        const remarks = (row["Remarks"] ?? "").toString().trim();
        const quantity = Number(row["Quantity"] ?? 0);

        if (!skillName) {
          // skip or throw—yahan skip kar raha hoon
          continue;
        }
        if (!(quantity > 0)) {
          // qty must be > 0
          continue;
        }

        // Skill level fetch
        const skillLevel = await SkillLevelCosting
          .findOne({ skillLevelName: skillName })
          .populate('type'); // agar uom ref hai to id mil jayegi

        if (!skillLevel) {
          throw new Error(`Skill Level not found: ${skillName}`);
        }

        // Auto-populated pricing & UOM
        const unitPrice = Number(
          skillLevel.unitPrice ??        // prefer unitPrice if present
          skillLevel.rate ?? 0      // fallback to rate
        );



        // Compute totals
        const salesPrice = unitPrice * quantity;
        const extPrice = salesPrice; // optional: keep for consistency with other quoteTypes

        newItem = {
          drawingId,
          quoteType,                                 // 'manhour'
          itemNumber: String(nextItemNumber).padStart(4, "0"),

          // Description/UOM per requirement
          description: skillLevel.skillLevelName,    // 👈 description = skill name
          uom: skillLevel.type._id,                                // 👈 UOM id from skill level
          skillLevel: skillLevel._id,                // keep link

          // From Excel
          quantity,
          remarks,

          // Auto-populated
          unitPrice,                                 // 👈 skill level rate
          salesPrice: Number(salesPrice.toFixed(2)),
          extPrice: Number(extPrice.toFixed(2)),

          // audit
          lastEditedBy: req.user?.id || null,
          // rfqDate: new Date(),
        };
      }


      // ===============================
      // 3️⃣ MATERIAL QUOTE LOGIC
      // ===============================
      else if (quoteType === "material") {
        // 🔹 Lookup related records
        const childPart = await Child.findOne({ ChildPartNo: row.ChildPart || row["Part Number"] }).populate("mpn");
        if (!childPart || !childPart.mpn) {
          throw new Error(`MPN not found for ChildPart: ${row.ChildPart}`);
        }
        const results = { errors: [] }; // 👈 temporary container

        const uomId = await getUomId(row["UOM"]);
        const quantity = Number(row["Qty"] || 0);
        const unitPrice = Number(childPart?.mpn?.RFQUnitPrice || 0);
        const tolerance = Number(row.Tolerance || 0);

        // 🔹 Excel percentage + fixed fields
        const sgaPercent = Number(row["SGA %"] || 0);
        const matBurden = Number(row["Mat Burden %"] || 0);
        const freightPercent = Number(row["Freight Cost %"] || 0);
        const fixedFreightCost = Number(row["Fixed Freight Cost"] || 0);

        // 🔹 Calculations
        const actualQty = quantity + (quantity * tolerance) / 100;
        const extPrice = quantity * unitPrice;

        // SalesPrice = extPrice * (1 + (sga% + matBurden% + freight%)/100) + fixedFreightCost
        const salesPrice =
          extPrice * (1 + (sgaPercent + matBurden + freightPercent) / 100) + fixedFreightCost;

        // 🔹 Build new costing item
        newItem = {
          drawingId,
          quoteType,
          itemNumber: String(nextItemNumber).padStart(4, "0"),
          childPart:childPart?._id,
          // From MPN
          mpn: childPart?.mpn?._id,
          description: (childPart?.mpn?.Description ?? "").toString().trim(),
          manufacturer: childPart?.mpn?.Manufacturer || "",
          uom: uomId,
          moq: Number(childPart?.mpn?.MOQ || 0),
          leadTime: Number(childPart?.mpn?.LeadTime_WK || 0),
          rfqDate: childPart?.mpn?.RFQDate,
          supplier: childPart?.mpn?.Supplier,
          unitPrice,

          // From Excel
          quantity,
          tolerance,
          actualQty,
          sgaPercent,
          matBurden,
          freightPercent,
          fixedFreightCost,

          // Computed
          extPrice: Number(extPrice.toFixed(2)),
          salesPrice: Number(salesPrice.toFixed(2)),

          lastEditedBy: req.user?.id || "System",
        };
      }


      console.log('---------newItem', newItem)

      if (newItem) {
        newItems.push(newItem);
        nextItemNumber++;
      }
    }

    if (newItems.length > 0) await CostingItems.insertMany(newItems);

    res.json({
      message: `✅ ${quoteType} import successful`,
      count: newItems.length,
    });
  } catch (error) {
    console.error("❌ Import Error:", error);
    res.status(500).json({
      message: "Failed to import costing items",
      error: error.message,
    });
  }
};


const pick = (row, ...keys) => {
  for (const k of keys) {
    if (k in row && row[k] !== undefined) return row[k];
  }
  return "";
};




//-----------------import drawings

// export const importDrawings = async (req, res) => {
//   try {
//     if (!req.file?.path) {
//       return res.status(400).json({ success: false, message: "No file uploaded" });
//     }

//     const incomingQuoteType = toStr(req.body?.quoteType); // "other" | "cable_harness" | ...
//     if (!incomingQuoteType) {
//       return res.status(400).json({ success: false, message: "quoteType is required" });
//     }

//     const name = (req.file.originalname || "").toLowerCase();
//     if (!name.endsWith(".xlsx") && !name.endsWith(".xls")) {
//       return res.status(400).json({ success: false, message: "Only .xlsx / .xls files are supported" });
//     }

//     let workbook;
//     try {
//       workbook = XLSX.readFile(req.file.path);
//     } catch (e) {
//       return res.status(400).json({ success: false, message: "Invalid Excel file", error: e.message });
//     }

//     if (!workbook.SheetNames?.length) {
//       return res.status(400).json({ success: false, message: "Excel has no sheets" });
//     }

//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     if (!sheet) {
//       return res.status(400).json({ success: false, message: "First sheet is missing" });
//     }

//     const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
//     if (!Array.isArray(rows) || rows.length === 0) {
//       return res.status(400).json({ success: false, message: "Sheet is empty" });
//     }

//     const results = { drawingsAdded: [], itemsAdded: 0, manhourAdded: 0, errors: [] };

//     // 🔹 Load latest/active master markups ONCE
//     const master = await MarkupParameter
//       .findOne({})
//       .sort({ updatedAt: -1 })
//       .select("materialsMarkup manhourMarkup packingMarkup")
//       .lean();

//     const masterMaterial = clampPct(master?.materialsMarkup, 0);
//     const masterManhour = clampPct(master?.manhourMarkup, 0);
//     const masterPacking = clampPct(master?.packingMarkup, 0);

//     // === Accept both 'other' and 'cable_harness' with SAME column schema ===
//     if (["other", "cable_harness"].includes(incomingQuoteType)) {
//       /**
//        * Columns expected:
//        * Drawing no | Description | Qty |
//        * Child Part | Description | MPN | Manufacturer | UOM | Qty | Tol-% | SGA-% | Mat Burden-% | Freight cost-% | Fixed Freight cost |
//        * Labour Skill Level | Labour Description | Labour UOM | (optional Labour Qty)
//        */

//       // 1) Group rows by Drawing no
//       const groups = new Map();
//       for (let i = 0; i < rows.length; i++) {
//         const r = rows[i];
//         const drawingNo = toStr(
//           pick(r, "Drawing no", "Drawing No", "drawingNo", "Drawing", "Drawing_no")
//         );
//         if (!drawingNo) {
//           results.errors.push({ row: i + 2, error: "Drawing no is required" });
//           continue;
//         }
//         if (!groups.has(drawingNo)) groups.set(drawingNo, []);
//         groups.get(drawingNo).push({ r, rowIndex: i + 2 });
//       }

//       // 2) Process each drawing group
//       for (const [drawingNo, list] of groups.entries()) {
//         const head = list[0]?.r || {};
//         const drawingDesc = toStr(pick(head, "Description", "drawingDescription"));
//         const drawingQty = toNum(pick(head, "Qty", "Quantity", "qty"), 1);

//         // Optional project/customer/currency wiring
//         let projectId = null, customerId = null, currency = null;

//         // Prevent duplicate drawing
//         const exists = await Drawing.findOne({ drawingNo }).lean();
//         if (exists) {
//           results.errors.push({ drawingNo, error: "Duplicate drawing number (already exists)" });
//           continue;
//         }

//         // Create the drawing (store the incoming quoteType)
//         const drawingDoc = await Drawing.create({
//           drawingNo,
//           description: drawingDesc,
//           qty: drawingQty || 1,
//           projectId,
//           customerId,
//           currency,
//           unitPrice: 0,
//           totalPrice: 0,
//           quoteType: incomingQuoteType,   // 👈 'other' or 'cable_harness'
//           quoteStatus: "active",
//           materialMarkup: masterMaterial,
//           manhourMarkup: masterManhour,
//           packingMarkup: masterPacking,
//           lastEditedBy: req.user?._id || null,
//         });

//         results.drawingsAdded.push({ id: drawingDoc._id, drawingNo });

//         // Continue item numbers from last existing, else start 0001
//         const lastItem = await CostingItems
//           .findOne({ drawingId: drawingDoc._id })
//           .sort({ itemNumber: -1 })
//           .select("itemNumber")
//           .lean();
//         let nextItemNumber = lastItem ? Number(lastItem.itemNumber) + 1 : 1;

//         const materialItems = [];
//         const manhourItems = [];

//         for (const { r, rowIndex } of list) {
//           // --- Material columns ---
//           const childParts = toStr(pick(r, "Child Part", "ChildPart", "childPart"));
//           const childDesc = toStr(pick(r, "Description", "Child Description", "Part Description"));
//           const mpn = toStr(pick(r, "MPN", "mpn"));
//           const manufacturer = toStr(pick(r, "Manufacturer", "manufacturer"));
//           const uomCell = toStr(pick(r, "UOM", "uom"));
//           const mQty = toNum(pick(r, "Qty", "Quantity", "qty"), 0);

//           const tolPct = toNum(pick(r, "Tol-%", "Tolerance %", "tolPct"), 0);
//           const sgaPct = toNum(pick(r, "SGA-%", "SGA %", "sgaPct"), 0);
//           const matBurdenPct = toNum(pick(r, "Mat Burden-% (9)", "Mat Burden-%", "Mat Burden %"), 0);
//           const freightPct = toNum(pick(r, "Freight cost-% (10)", "Freight cost-%", "Freight Cost %"), 0);
//           const fixedFreight = toNum(pick(r, "Fixed Freight cost", "Fixed Freight", "Fixed Freight Cost"), 0);

//           // Only create a material line if we have some identity + quantity
//           const hasMaterialLine = (childParts || mpn || childDesc) && mQty > 0;
//           if (hasMaterialLine) {
//             const uomId = await getUomId(uomCell, results.errors, { rowIndex, drawingNo }); // 👈 RESOLVE via UOM model
//             const childPart = await Child.findOne({ ChildPartNo: childParts }).populate("mpn");


//             const quantity = Number(mQty || 0);
//             const unitPrice = Number(childPart?.mpn?.RFQUnitPrice || 0);
//             const tolerance = Number(tolPct || 0);

//             const sgaPercent = Number(sgaPct || 0);
//             const matBurden = Number(matBurdenPct || 0);
//             const freightPercent = Number(freightPct || 0);
//             const fixedFreightCost = Number(fixedFreight || 0);

//             const actualQty = quantity + (quantity * tolerance) / 100;
//             const extPrice = quantity * unitPrice;

//             const salesPrice = extPrice * (1 + (sgaPercent + matBurden + freightPercent) / 100) + fixedFreightCost;
//             const item = {
//               drawingId: drawingDoc._id,
//               quoteType: 'material',                  // 👈 keep items under the same drawing quoteType
//               itemNumber: String(nextItemNumber).padStart(4, "0"),

//               // From Excel (direct, no external MPN/manufacturer lookup)

//               mpn: childPart?.mpn?._id,
//               description: (childPart?.mpn?.Description ?? "").toString().trim(),
//               manufacturer: childPart?.mpn?.Manufacturer || "",
//               // uom: childPart?.mpn?.UOM,
//               moq: Number(childPart?.mpn?.MOQ || 0),
//               leadTime: Number(childPart?.mpn?.LeadTime_WK || 0),
//               rfqDate: childPart?.mpn?.RFQDate,
//               supplier: childPart?.mpn?.Supplier,

//               // childPartNo: childPart,
//               // description: childDesc,
//               // mpnName: mpn,
//               // manufacturer: manufacturer,
//               uom: uomId,                             // 👈 store UOM ObjectId
//               // uomText: uomCell || null,                   // optional: keep source text for audit

//               quantity,
//               tolerance,
//               sgaPercent,
//               matBurden,
//               freightPercent,
//               fixedFreightCost,

//               // prices 0 (no lookups here)
//               unitPrice,
//               extPrice: Number(extPrice.toFixed(2)),
//               salesPrice: Number(salesPrice.toFixed(2)),

//               lastEditedBy: req.user?._id || null,
//             };

//             materialItems.push(item);
//             nextItemNumber++;
//           }

//           // --- Labour columns → manhour items ---
//           const labourSkill = toStr(pick(r, "Labour Skill Level", "Skill Level", "Labour Level"));
//           const labourDesc = toStr(pick(r, "Labour Description", "Labour Remarks", "Remarks"));
//           const labourUomTx = toStr(pick(r, "Labour UOM", "UOM (Labour)", "LabourUOM"));
//           const quantity = toNum(pick(r, "Labour Qty", "Qty (Labour)", "Labour Quantity", "Quantity"), 0);

//           const hasLabour = (labourSkill || labourDesc || labourUomTx) && quantity > 0;
//           if (hasLabour) {
//             const labourUomId = await getUomId(labourUomTx, results.errors, { rowIndex, drawingNo }); // 👈 resolve UOM

//             const skillLevel = await SkillLevelCosting
//               .findOne({ skillLevelName: labourSkill })
//               .populate('type'); // agar uom ref hai to id mil jayegi

//             const unitPrice = Number(
//               skillLevel.unitPrice ??        // prefer unitPrice if present
//               skillLevel.rate ?? 0      // fallback to rate
//             );

//             const salesPrice = unitPrice * quantity;
//             const extPrice = salesPrice;
//             const man = {
//               drawingId: drawingDoc._id,
//               quoteType: "manhour",                           // 👈 labour always stored as manhour type
//               itemNumber: String(nextItemNumber).padStart(4, "0"),

//               description: labourDesc || labourSkill,
//               skillLevel: skillLevel?._id,
//               uom: labourUomId,                    // 👈 UOM ObjectId
//               // uomText: labourUomTx || null,            // optional preserve text
//               quantity,

//               unitPrice,                                 // 👈 skill level rate
//               salesPrice: Number(salesPrice.toFixed(2)),
//               extPrice: Number(extPrice.toFixed(2)),

//               lastEditedBy: req.user?._id || null,
//             };
//             manhourItems.push(man);
//             nextItemNumber++;
//           }
//         }

//         if (materialItems.length) {
//           await CostingItems.insertMany(materialItems);
//           results.itemsAdded += materialItems.length;
//         }
//         if (manhourItems.length) {
//           await CostingItems.insertMany(manhourItems);
//           results.manhourAdded += manhourItems.length;
//         }
//       }

//       return res.status(200).json({
//         success: true,
//         message: `Import complete — Drawings: ${results.drawingsAdded.length}, ${incomingQuoteType} lines: ${results.itemsAdded}, Manhour lines: ${results.manhourAdded}, Errors: ${results.errors.length}`,
//         data: results,
//       });
//     }

//     // Fallback for any other quoteType
//     return res.status(400).json({
//       success: false,
//       message: `Unsupported quoteType "${incomingQuoteType}" in this endpoint. Use "other" or "cable_harness".`,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Error importing drawings",
//       error: error.message,
//     });
//   } finally {
//     try { if (req.file?.path) fs.unlinkSync(req.file.path); } catch { }
//   }
// };

const getNextItemNumberForType = async (drawingId, quoteType) => {
  // itemNumber is fixed 4-digit string → lexicographic sort works
  const last = await CostingItems
    .findOne({ drawingId, quoteType })
    .sort({ itemNumber: -1 }) // e.g., "0099" > "0008"
    .select("itemNumber")
    .lean();

  const lastNum = last ? parseInt(String(last.itemNumber || "0000"), 10) : 0;
  const next = (isFinite(lastNum) ? lastNum : 0) + 1;

  if (next > 9999) {
    throw new Error(`Item number overflow for ${quoteType} on drawing ${drawingId} (max 9999).`);
  }
  return next; // return as integer; caller will pad to 4 digits
};

const fmtNo4 = (n) => String(n).padStart(4, "0");


export const importDrawings = async (req, res) => {
  try {
    if (!req.file?.path) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const incomingQuoteType = toStr(req.body?.quoteType); // "other" | "cable_harness" | ...
    if (!incomingQuoteType) {
      return res.status(400).json({ success: false, message: "quoteType is required" });
    }

    const name = (req.file.originalname || "").toLowerCase();
    if (!name.endsWith(".xlsx") && !name.endsWith(".xls")) {
      return res.status(400).json({ success: false, message: "Only .xlsx / .xls files are supported" });
    }

    let workbook;
    try {
      workbook = XLSX.readFile(req.file.path);
    } catch (e) {
      return res.status(400).json({ success: false, message: "Invalid Excel file", error: e.message });
    }

    if (!workbook.SheetNames?.length) {
      return res.status(400).json({ success: false, message: "Excel has no sheets" });
    }

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    if (!sheet) {
      return res.status(400).json({ success: false, message: "First sheet is missing" });
    }

    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ success: false, message: "Sheet is empty" });
    }

    const results = { drawingsAdded: [], itemsAdded: 0, manhourAdded: 0, errors: [] };

    // 🔹 Load latest/active master markups ONCE
    const master = await MarkupParameter
      .findOne({})
      .sort({ updatedAt: -1 })
      .select("materialsMarkup manhourMarkup packingMarkup")
      .lean();

    const masterMaterial = clampPct(master?.materialsMarkup, 0);
    const masterManhour = clampPct(master?.manhourMarkup, 0);
    const masterPacking = clampPct(master?.packingMarkup, 0);

    // ─────────────────────────────────────────────────────────────
    // helpers to support header+child rows under same drawing
    // ─────────────────────────────────────────────────────────────
    const groupRowsByDrawing = (rows, results) => {
      const groups = new Map(); // drawingNo -> [{ r, rowIndex }]
      let currentDrawingNo = null;

      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        const rowIndex = i + 2; // Excel line number (header is line 1)
        const drawingNo = toStr(pick(r, "Drawing no", "Drawing No", "drawingNo", "Drawing", "Drawing_no"));

        if (drawingNo) {
          currentDrawingNo = drawingNo;
          if (!groups.has(drawingNo)) groups.set(drawingNo, []);
          groups.get(drawingNo).push({ r, rowIndex });
        } else {
          if (!currentDrawingNo) {
            results.errors.push({ row: rowIndex, error: "Row found before any 'Drawing no' header" });
            continue;
          }
          groups.get(currentDrawingNo).push({ r, rowIndex });
        }
      }
      return groups;
    };

    const getDrawingHeadValues = (list) => {
      const headEntry =
        list.find(({ r }) => {
          const hasDesc = toStr(pick(r, "Description", "drawingDescription"));
          const hasQty = toStr(pick(r, "Qty", "Quantity", "qty"));
          return hasDesc || hasQty;
        }) || list[0];

      const head = headEntry?.r || {};
      const drawingDesc = toStr(pick(head, "Description", "drawingDescription"));
      const drawingQty = toNum(pick(head, "Qty", "Quantity", "qty"), 1);
      return { drawingDesc, drawingQty };
    };
    // ─────────────────────────────────────────────────────────────

    // === Accept both 'other' and 'cable_harness' with SAME column schema ===
    if (["other", "cable_harness"].includes(incomingQuoteType)) {
      /**
       * Header + child rows pattern supported:
       * - Header (has Drawing no) may also contain material/labour cells → import them.
       * - Subsequent rows with blank Drawing no belong to the same drawing until next header.
       *
       * Columns expected among the rows:
       * Drawing no | Description | Qty |
       * Child Part | Description | MPN | Manufacturer | UOM | Qty | Tol-% | SGA-% | Mat Burden-% | Freight cost-% | Fixed Freight cost |
       * Labour Skill Level | Labour Description | Labour UOM | Labour Qty
       */

      // 1) Group rows by (carry-forward) Drawing no
      const groups = groupRowsByDrawing(rows, results);

      // 2) Process each drawing group
      for (const [drawingNo, list] of groups.entries()) {
        const { drawingDesc, drawingQty } = getDrawingHeadValues(list);

        // Prevent duplicate drawing
        const exists = await Drawing.findOne({ drawingNo }).lean();
        if (exists) {
          results.errors.push({ drawingNo, error: "Duplicate drawing number (already exists)" });
          continue;
        }

        // Create the drawing (store the incoming quoteType)
        const drawingDoc = await Drawing.create({
          drawingNo,
          description: drawingDesc,
          qty: drawingQty || 1,
          projectId: null,
          customerId: null,
          currency: null,
          unitPrice: 0,
          totalPrice: 0,
          quoteType: incomingQuoteType,   // 'other' or 'cable_harness'
          quoteStatus: "active",
          materialMarkup: masterMaterial,
          manhourMarkup: masterManhour,
          packingMarkup: masterPacking,
          lastEditedBy: req.user?._id || null,
        });

        // Independent counters per quoteType
        let nextMatNo = await getNextItemNumberForType(drawingDoc._id, "material");
        let nextManNo = await getNextItemNumberForType(drawingDoc._id, "manhour");


        const materialItems = [];
        const manhourItems = [];

        for (const { r, rowIndex } of list) {
          // Skip rows that truly have nothing
          const anyVal =
            toStr(pick(r, "Child Part", "ChildPart", "childPart")) ||
            toStr(pick(r, "MPN", "mpn")) ||
            toStr(pick(r, "Description", "Child Description", "Part Description")) ||
            toStr(pick(r, "UOM", "uom")) ||
            toStr(pick(r, "Labour Skill Level", "Skill Level", "Labour Level")) ||
            toStr(pick(r, "Labour Description", "Labour Remarks", "Remarks")) ||
            toStr(pick(r, "Labour UOM", "UOM (Labour)", "LabourUOM")) ||
            toStr(pick(r, "Labour Qty", "Qty (Labour)", "Labour Quantity", "Quantity"));
          if (!anyVal) continue;

          // --- Material columns (can be on header row or child rows) ---
          const childParts = toStr(pick(r, "Child Part", "ChildPart", "childPart"));
          const childDesc = toStr(pick(r, "Description", "Child Description", "Part Description"));
          const mpn = toStr(pick(r, "MPN", "mpn"));
          const manufacturer = toStr(pick(r, "Manufacturer", "manufacturer"));
          const uomCell = toStr(pick(r, "UOM", "uom"));
          const Qty = toNum(pick(r, "Qty", "Quantity", "qty"), 0);
          const mQty = toNum(pick(r, "Material Qty", "material qty"), 0);
          const tolPct = toNum(pick(r, "Tol-%", "Tolerance %", "tolPct"), 0);
          const sgaPct = toNum(pick(r, "SGA-%", "SGA %", "sgaPct"), 0);
          const matBurdenPct = toNum(pick(r, "Mat Burden-% (9)", "Mat Burden-%", "Mat Burden %"), 0);
          const freightPct = toNum(pick(r, "Freight cost-% (10)", "Freight cost-%", "Freight Cost %"), 0);
          const fixedFreight = toNum(pick(r, "Fixed Freight cost", "Fixed Freight", "Fixed Freight Cost"), 0);

          const hasMaterialLine = childParts;
          if (hasMaterialLine) {
            const uomId = await getUomId(uomCell, results.errors, { rowIndex, drawingNo });

            // If you want to enrich using Child→MPN, keep your lookup (optional):
            const childPart = childParts
              ? await Child.findOne({ ChildPartNo: childParts }).populate("mpn")
              : null;

            // Prefer MPN info if found; else keep Excel values
            const unitPrice = Number(childPart?.mpn?.RFQUnitPrice || 0);
            const quantity = Number(mQty || 0);
            const tolerance = Number(tolPct || 0);
            const extPrice = quantity * unitPrice;
            const salesPrice =
              extPrice * (1 + (Number(sgaPct) + Number(matBurdenPct) + Number(freightPct)) / 100) + Number(fixedFreight);

            materialItems.push({
              drawingId: drawingDoc._id,
              quoteType: "material", // ✅ always "material"
              itemNumber: fmtNo4(nextMatNo),

              // from Excel
              childPart: childPart?._id || null,
              description: childPart?.mpn?.Description?.toString()?.trim() || childDesc || "",
              mpn: childPart?.mpn?._id,
              manufacturer: childPart?.mpn?.Manufacturer || manufacturer || "",
              uom: uomId,
              rfqDate:childPart?.mpn?.RFQDate,
              supplier: childPart?.mpn?.Supplier,
              // uomText: uomCell || null,
              leadTime: Number(childPart?.mpn?.LeadTime_WK || 0),
              quantity,
              tolerance,
              sgaPercent: sgaPct,
              matBurden: matBurdenPct,
              freightPercent: freightPct,
              fixedFreightCost: fixedFreight,

              unitPrice: Number(unitPrice || 0),
              extPrice: Number((extPrice || 0).toFixed(2)),
              salesPrice: Number((salesPrice || 0).toFixed(2)),

              lastEditedBy: req.user?._id || null,
            });
            nextMatNo++;
          }

          // --- Labour columns (header or child rows) → manhour items ---
          const labourSkill = toStr(pick(r, "Labour Skill Level", "Skill Level", "Labour Level"));
          const labourDesc = toStr(pick(r, "Labour Description", "Labour Remarks", "Remarks"));
          const labourUomTx = toStr(pick(r, "Labour UOM", "UOM (Labour)", "LabourUOM"));
          const labourQty = toNum(pick(r, "Labour Qty", "Qty (Labour)", "Labour Quantity", "Quantity"), 0);
          const remarks = toNum(pick(r, "Remarks", "remarks"), 0);
          const hasLabour = (labourSkill || labourDesc || labourUomTx) && labourQty > 0;
          if (hasLabour) {
            const labourUomId = await getUomId(labourUomTx, results.errors, { rowIndex, drawingNo });
            let skillLevel = null;
            // optional pricing via SkillLevelCosting
            try {
              if (labourSkill) {
                skillLevel = await SkillLevelCosting
                  .findOne({ skillLevelName: labourSkill })
                  .select("_id skillLevelName unitPrice rate type") // fetch what you need
                  .populate("type") // if UOM ref is needed
                  .lean();


              }
            } catch (error) {
              console.error("SkillLevelCosting lookup failed:", error.message);
            }

            const salesPrice = skillLevel?.rate * labourQty;
            manhourItems.push({
              drawingId: drawingDoc._id,
              quoteType: "manhour",
              itemNumber: fmtNo4(nextManNo),

              description: labourDesc || labourSkill,
              // skillLevelName: labourSkill,
              uom: labourUomId,
              remarks,
              // uomText: labourUomTx || null,
              quantity: labourQty,
              skillLevel: skillLevel._id,
              unitPrice: skillLevel?.rate,
              extPrice: Number((salesPrice || 0).toFixed(2)),
              salesPrice: Number((salesPrice || 0).toFixed(2)),

              lastEditedBy: req.user?._id || null,
            });
            nextManNo++;
          }
        }

        if (materialItems.length) {
          await CostingItems.insertMany(materialItems);
          results.itemsAdded += materialItems.length;
        }
        if (manhourItems.length) {
          await CostingItems.insertMany(manhourItems);
          results.manhourAdded += manhourItems.length;
        }

        results.drawingsAdded.push({
          id: drawingDoc._id,
          drawingNo,
          rows: list.length,
          materialItems: materialItems.length,
          manhourItems: manhourItems.length,
        });
      }

      return res.status(200).json({
        success: true,
        message: `Import complete — Drawings: ${results.drawingsAdded.length}, Material lines: ${results.itemsAdded}, Manhour lines: ${results.manhourAdded}, Errors: ${results.errors.length}`,
        data: results,
      });
    }

    // Fallback for any other quoteType
    return res.status(400).json({
      success: false,
      message: `Unsupported quoteType "${incomingQuoteType}" in this endpoint. Use "other" or "cable_harness".`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error importing drawings",
      error: error.message,
    });
  } finally {
    try { if (req.file?.path) fs.unlinkSync(req.file.path); } catch { }
  }
};
