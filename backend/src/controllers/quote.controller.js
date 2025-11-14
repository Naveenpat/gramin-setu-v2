import ExcelJS from 'exceljs';
import * as XLSX from 'xlsx';
import Customer from '../models/Customer.js';
import Drawing from '../models/Drwaing.js';
import Quote from '../models/Quote.js';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun, AlignmentType, UnderlineType } from 'docx';


// ---------------- CREATE QUOTE ----------------
// export const createQuote = async (req, res) => {
//   try {
//     const { customerId, items, validUntil, status = 'draft' } = req.body;

//     const customer = await Customer.findById(customerId);
//     if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });

//     const quoteItems = [];
//     for (const item of items) {
//       const drawing = await Drawing.findById(item.drawingId);
//       if (!drawing) return res.status(404).json({ success: false, message: `Drawing ${item.drawingId} not found` });

//       quoteItems.push({
//         drawingId: item.drawingId,
//         drawingNumber: drawing.drawingNumber || drawing.drawingNo,
//         tool: drawing.tool || drawing.description || '—',
//         unitPrice: drawing.unitPrice || 0,
//         quantity: item.quantity || 1,
//         totalPrice: (drawing.unitPrice || 0) * (item.quantity || 1)
//       });
//     }

//     const quote = new Quote({
//       customerId,
//       customerName: customer.contactPerson,
//       customerEmail: customer.email,
//       customerCompany: customer.companyName,
//       items: quoteItems,
//       validUntil: new Date(validUntil),
//       status,
//       createdBy: req.user._id,
//       updatedBy: req.user._id
//     });

//     await quote.save();

//     const populatedQuote = await Quote.findById(quote._id)
//       .populate('customerId', 'companyName contactPerson email phone address')
//       .populate('createdBy', 'name email')
//       .populate('updatedBy', 'name email');

//     res.status(201).json({ success: true, message: 'Quote created successfully', data: populatedQuote });
//   } catch (error) {
//     console.error('CreateQuote Error:', error);
//     res.status(500).json({ success: false, message: 'Error creating quote', error: error.message });
//   }
// };

export const createQuote = async (req, res) => {
  try {
    const { customerId, items, validUntil, status = 'draft' } = req.body;

    const customer = await Customer.findById(customerId);
    if (!customer)
      return res.status(404).json({ success: false, message: 'Customer not found' });

    const quoteItems = [];
    let totalQuantity = 0;
    let totalQuoteValue = 0;

    for (const item of items) {
      const drawing = await Drawing.findById(item.drawingId);
      if (!drawing)
        return res.status(404).json({
          success: false,
          message: `Drawing ${item.drawingId} not found`
        });

      const qty = item.quantity || 1;
      const price = drawing.unitPrice || 0;

      quoteItems.push({
        drawingId: item.drawingId,
        drawingNumber: drawing.drawingNumber || drawing.drawingNo,
        tool: drawing.tool || drawing.description || '—',
        unitPrice: price,
        quantity: qty,
        totalPrice: price * qty
      });

      totalQuantity += qty;
      totalQuoteValue += price * qty;
    }

    const totalDrawings = quoteItems.length;

    // Generate quote number (example: Q-20251007-001)
    const datePart = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const randomPart = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    const quoteNumber = `Q-${datePart}-${randomPart}`;

    const quote = new Quote({
      customerId,
      customerName: customer.contactPerson,
      customerEmail: customer.email,
      customerCompany: customer.companyName,
      items: quoteItems,
      totalQuantity,
      totalDrawings,
      totalQuoteValue,
      quoteNumber,
      quotedDate: new Date(),
      validUntil: new Date(validUntil),
      status,
      createdBy: req.user._id,
      updatedBy: req.user._id
    });

    await quote.save();

    const populatedQuote = await Quote.findById(quote._id)
      .populate('customerId', 'companyName contactPerson email phone address')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    res
      .status(201)
      .json({ success: true, message: 'Quote created successfully', data: populatedQuote });
  } catch (error) {
    console.error('CreateQuote Error:', error);
    res.status(500).json({ success: false, message: 'Error creating quote', error: error.message });
  }
};


// ---------------- GET ALL QUOTES ----------------
export const getAllQuotes = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, customerId, startDate, endDate, search } = req.query;

    const filter = { isDeleted: false };
    if (status) filter.status = status;
    if (customerId) filter.customerId = customerId;
    if (startDate || endDate) {
      filter.quoteDate = {};
      if (startDate) filter.quoteDate.$gte = new Date(startDate);
      if (endDate) filter.quoteDate.$lte = new Date(endDate);
    }
    if (search) {
      filter.$or = [
        { quoteNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerCompany: { $regex: search, $options: 'i' } }
      ];
    }

    const quotes = await Quote.find(filter)
      .sort({ created: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('customerId', 'companyName contactPerson email')
      .populate('createdBy', 'name email');

    const totalQuotes = await Quote.countDocuments(filter);

    res.json({
      success: true,
      data: quotes,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalQuotes / limit),
        totalQuotes
      }
    });
  } catch (error) {
    console.error('GetAllQuotes Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching quotes', error: error.message });
  }
};

// ---------------- GET QUOTE BY ID ----------------
export const getQuoteById = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id)
      .populate('customerId')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .populate('items.drawingId');

    if (!quote || quote.isDeleted) return res.status(404).json({ success: false, message: 'Quote not found' });

    res.json({ success: true, data: quote });
  } catch (error) {
    console.error('GetQuoteById Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching quote', error: error.message });
  }
};

// ---------------- UPDATE QUOTE ----------------
// export const updateQuote = async (req, res) => {
//   try {
//     const { items, ...updateData } = req.body;

//     if (items) {
//       const quoteItems = [];
//       for (const item of items) {
//         const drawing = await Drawing.findById(item.drawingId);
//         if (!drawing) return res.status(404).json({ success: false, message: `Drawing ${item.drawingId} not found` });

//         quoteItems.push({
//           drawingId: item.drawingId,
//           drawingNumber: drawing.drawingNumber,
//           tool: drawing.tool || drawing.description || '—',
//           unitPrice: drawing.unitPrice || 0,
//           quantity: item.quantity || 1,
//           totalPrice: (drawing.unitPrice || 0) * (item.quantity || 1)
//         });
//       }
//       updateData.items = quoteItems;
//     }

//     updateData.updatedBy = req.user._id;
//     updateData.updated = new Date();

//     const quote = await Quote.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
//       .populate('customerId')
//       .populate('createdBy', 'name email')
//       .populate('updatedBy', 'name email')
//       .populate('items.drawingId');

//     if (!quote) return res.status(404).json({ success: false, message: 'Quote not found' });

//     res.json({ success: true, message: 'Quote updated successfully', data: quote });
//   } catch (error) {
//     console.error('UpdateQuote Error:', error);
//     res.status(500).json({ success: false, message: 'Error updating quote', error: error.message });
//   }
// };

export const updateQuote = async (req, res) => {
  try {
    const { items, ...updateData } = req.body;

    if (items) {
      const quoteItems = [];
      let totalQuantity = 0;
      let totalQuoteValue = 0;

      for (const item of items) {
        const drawing = await Drawing.findById(item.drawingId);
        if (!drawing) {
          return res.status(404).json({
            success: false,
            message: `Drawing ${item.drawingId} not found`
          });
        }

        const qty = item.quantity || 1;
        const price = item.unitPrice || drawing.unitPrice || 0;
        const drawingNumber = drawing.drawingNumber || drawing.drawingNo;

        // Validate required fields
        if (!drawingNumber) {
          return res.status(400).json({
            success: false,
            message: `Drawing number is required for drawing ${item.drawingId}`
          });
        }

        const quoteItem = {
          drawingId: item.drawingId,
          drawingNumber: drawingNumber,
          tool: drawing.tool || drawing.description || '—',
          unitPrice: price,
          quantity: qty,
          totalPrice: price * qty
        };

        quoteItems.push(quoteItem);
        totalQuantity += qty;
        totalQuoteValue += price * qty;
      }

      updateData.items = quoteItems;
      updateData.totalQuantity = totalQuantity;
      updateData.totalQuoteValue = totalQuoteValue;
      updateData.totalDrawings = quoteItems.length;
    }

    updateData.updatedBy = req.user._id;
    updateData.updated = new Date();

    const quote = await Quote.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('customerId', 'companyName contactPerson email phone address')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }

    res.json({
      success: true,
      message: 'Quote updated successfully',
      data: quote
    });
  } catch (error) {
    console.error('UpdateQuote Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating quote',
      error: error.message
    });
  }
};

// ---------------- DELETE QUOTE (soft) ----------------
export const deleteQuote = async (req, res) => {
  try {
    const quote = await Quote.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, isActive: false, updatedBy: req.user._id, updated: new Date() },
      { new: true }
    );

    if (!quote) return res.status(404).json({ success: false, message: 'Quote not found' });

    res.json({ success: true, message: 'Quote deleted successfully' });
  } catch (error) {
    console.error('DeleteQuote Error:', error);
    res.status(500).json({ success: false, message: 'Error deleting quote', error: error.message });
  }
};

// ---------------- GET QUOTES BY CUSTOMER ----------------
export const getQuotesByCustomer = async (req, res) => {
  try {
    const quotes = await Quote.find({ customerId: req.params.customerId, isDeleted: false })
      .populate('createdBy', 'name email')
      .sort({ created: -1 });

    res.json({ success: true, data: quotes });
  } catch (error) {
    console.error('GetQuotesByCustomer Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching customer quotes', error: error.message });
  }
};

// ---------------- UPDATE QUOTE STATUS ----------------
export const updateQuoteStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const quote = await Quote.findByIdAndUpdate(
      req.params.id,
      { status, updatedBy: req.user._id, updated: new Date() },
      { new: true, runValidators: true }
    ).populate('customerId').populate('createdBy', 'name email');

    if (!quote) return res.status(404).json({ success: false, message: 'Quote not found' });

    res.json({ success: true, message: 'Quote status updated successfully', data: quote });
  } catch (error) {
    console.error('UpdateQuoteStatus Error:', error);
    res.status(500).json({ success: false, message: 'Error updating quote status', error: error.message });
  }
};

// ---------------- EXPORT SINGLE QUOTE TO EXCEL ----------------
/* ---------- helpers ---------- */
const S = v => (v === null || v === undefined ? '' : String(v));
const N = (v, d = 2) => {
  const num = Number(v);
  return Number.isFinite(num) ? Number(num.toFixed(d)) : 0;
};
const D = v => {
  try { return v ? new Date(v).toLocaleDateString('en-GB') : ''; } catch { return ''; }
};

/* =========================================================
   EXCEL (ExcelJS) — styled, aligned, widths, totals
   ========================================================= */
export const exportQuoteToExcel = async (req, res) => {
  try {
    const quoteId = req.params.quoteId;
    const quote = await Quote.findById(quoteId)
      .populate('customerId')
      .populate('items.drawingId')
      .lean();

    if (!quote) {
      return res.status(404).json({ success: false, message: 'Quote not found' });
    }

    // Normalize fields
    const customerName = S(quote.customerName || quote.customerId?.name);
    const customerCompany = S(quote.customerCompany || quote.customerId?.companyName);
    const customerEmail = S(quote.customerEmail || quote.customerId?.email);
    const quoteDate = D(quote.quoteDate);
    const validUntil = D(quote.validUntil);
    const items = Array.isArray(quote.items) ? quote.items : [];

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Quote Details', {
      properties: { defaultRowHeight: 18 },
      views: [{ state: 'frozen', ySplit: 1 }] // freeze header
    });

    // Title
    ws.mergeCells('A1:F1');
    ws.getCell('A1').value = `Quote #${S(quote.quoteNumber)}`;
    ws.getCell('A1').font = { bold: true, size: 16 };
    ws.getCell('A1').alignment = { horizontal: 'center' };

    // Customer block
    ws.addRow([]);
    ws.addRow(['Customer Name', customerName]);
    ws.addRow(['Company', customerCompany]);
    ws.addRow(['Email', customerEmail]);
    ws.addRow(['Quote Date', quoteDate]);
    ws.addRow(['Valid Until', validUntil]);
    ws.addRow([]);

    // Header
    const header = [
      'Drawing Number',
      'Tool',
      'Unit Price',
      'Quantity',
      'Total Price',
      'Notes'
    ];
    const headerRow = ws.addRow(header);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    ws.autoFilter = { from: { row: headerRow.number, column: 1 }, to: { row: headerRow.number, column: header.length } };

    // Column widths (approx)
    ws.columns = [
      { key: 'drawing', width: 22 },
      { key: 'tool', width: 16 },
      { key: 'unit', width: 14 },
      { key: 'qty', width: 12 },
      { key: 'total', width: 16 },
      { key: 'note', width: 30 },
    ];

    const startDataRow = ws.lastRow.number + 1;

    // Data rows
    items.forEach(it => {
      const drawingNo = S(it?.drawingNumber || it?.drawingId?.drawingNumber);
      const tool = S(it?.tool);
      const unit = N(it?.unitPrice);
      const qty = N(it?.quantity, 0);
      const totalCalc = Number.isFinite(Number(it?.totalPrice))
        ? N(it.totalPrice)
        : N(N(it?.unitPrice) * N(it?.quantity));

      const r = ws.addRow([drawingNo, tool, unit, qty, totalCalc, S(it?.remarks)]);
      // align numeric columns
      r.getCell(3).alignment = { horizontal: 'right' };
      r.getCell(4).alignment = { horizontal: 'right' };
      r.getCell(5).alignment = { horizontal: 'right' };
      // number formats
      r.getCell(3).numFmt = '#,##0.00';
      r.getCell(4).numFmt = '#,##0';
      r.getCell(5).numFmt = '#,##0.00';
    });

    // Totals row
    const endDataRow = ws.lastRow.number;
    const totals = ws.addRow([
      'Totals',
      '',
      { formula: `SUM(C${startDataRow}:C${endDataRow})` },
      { formula: `SUM(D${startDataRow}:D${endDataRow})` },
      { formula: `SUM(E${startDataRow}:E${endDataRow})` },
      ''
    ]);

    // Style totals row
    totals.eachCell((cell, col) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: col >= 3 && col <= 5 ? 'right' : 'left' };
      if (col === 3 || col === 5) cell.numFmt = '#,##0.00';
      if (col === 4) cell.numFmt = '#,##0';
      // full-row top border
      cell.border = { top: { style: 'thin' } };
      // soft highlight fill
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFDF2CC' } // pale yellow
      };
    });

    // Update status (optional)
    await Quote.updateOne({ _id: quoteId }, { $set: { status: 'quoted', isPendingQuote: false } });

    const buf = await wb.xlsx.writeBuffer();

    res.status(200);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="quote-${S(quote.quoteNumber)}.xlsx"`);
    res.setHeader('Content-Length', buf.byteLength);
    return res.end(Buffer.from(buf));
  } catch (err) {
    console.error('ExportQuoteToExcel Error:', err);
    return res.status(500).json({ success: false, message: 'Error exporting quote to Excel' });
  }
};

export const exportQuoteToWord = async (req, res) => {
  try {
    const quoteId = req.params.quoteId || req.params.id;
    const quote = await Quote.findById(quoteId)
      .populate('customerId')
      .populate('items.drawingId');

    if (!quote) {
      return res.status(404).json({ success: false, message: 'Quote not found' });
    }

    const S = (v) => (v === null || v === undefined ? '' : String(v));
    const N = (v, d = 2) => {
      const num = Number(v);
      return Number.isFinite(num) ? num.toFixed(d) : (0).toFixed(d);
    };
    const D = (v) => { try { return v ? new Date(v).toLocaleDateString('en-GB') : ''; } catch { return ''; } };
    const T = (text, extra = {}) =>
      new TextRun({ text: S(text), underline: { type: UnderlineType.NONE }, ...extra });

    // Title
    const title = new Paragraph({
      children: [T(`QUOTE: ${S(quote.quoteNumber)}`, { bold: true, size: 32 })],
      spacing: { after: 400 },
    });

    // Customer details
    const customerDetails = new Paragraph({
      children: [
        T(`Customer: ${S(quote.customerName || quote.customerId?.name)}`), new TextRun({ break: 1 }),
        T(`Company: ${S(quote.customerCompany || quote.customerId?.companyName)}`), new TextRun({ break: 1 }),
        T(`Email: ${S(quote.customerEmail || quote.customerId?.email)}`), new TextRun({ break: 1 }),
        T(`Quote Date: ${D(quote.quoteDate)}`), new TextRun({ break: 1 }),
        T(`Valid Until: ${D(quote.validUntil)}`),
      ],
      spacing: { after: 400 },
    });

    // Header row
    const headerCells = ['Drawing Number', 'Tool', 'Unit Price', 'Quantity', 'Total Price']
      .map(h => new TableCell({
        children: [new Paragraph({ children: [T(h, { bold: true })], alignment: AlignmentType.CENTER })],
      }));
    const headerRow = new TableRow({ children: headerCells });

    // Item rows — set alignment per paragraph directly
    const itemRows = (quote.items || []).map(item => {
      const drawingNo = S(item?.drawingNumber || item?.drawingId?.drawingNumber);
      const tool = S(item?.tool);
      const unit = N(item?.unitPrice);
      const qty = S(item?.quantity ?? '');
      const total = Number.isFinite(Number(item?.totalPrice))
        ? N(item?.totalPrice)
        : N(Number(item?.unitPrice) * Number(item?.quantity));

      return new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [T(drawingNo)] })] }),
          new TableCell({ children: [new Paragraph({ children: [T(tool)] })] }),
          new TableCell({ children: [new Paragraph({ children: [T(unit)], alignment: AlignmentType.RIGHT })] }),
          new TableCell({ children: [new Paragraph({ children: [T(qty)], alignment: AlignmentType.RIGHT })] }),
          new TableCell({ children: [new Paragraph({ children: [T(total)], alignment: AlignmentType.RIGHT })] }),
        ],
      });
    });

    // Table
    const table = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [headerRow, ...itemRows],
      columnWidths: [4000, 2600, 2200, 2000, 2400],
    });

    // Summary
    const summary = new Paragraph({
      children: [
        T(`Total Drawings: ${S(quote.totalDrawings ?? 0)}`, { bold: true }),
        new TextRun({ break: 1 }),
        T(`Total Quantity: ${S(quote.totalQuantity ?? 0)}`, { bold: true }),
        new TextRun({ break: 1 }),
        T(`Total Quote Value: ${N(quote.totalQuoteValue)}`, { bold: true }),
      ],
      spacing: { before: 400 },
    });

    // Optional: update status
    await Quote.updateOne({ _id: quoteId }, { $set: { status: 'quoted', isPendingQuote: false } });

    // Build & send
    const doc = new Document({
      creator: 'Quote Generator',
      title: `Quote ${S(quote.quoteNumber)}`,
      sections: [{ properties: {}, children: [title, customerDetails, table, summary] }],
    });

    const buffer = await Packer.toBuffer(doc);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="quote-${S(quote.quoteNumber)}.docx"`);
    return res.send(buffer);
  } catch (error) {
    console.error('ExportQuoteToWord Error:', error);
    return res.status(500).json({ success: false, message: 'Error exporting quote to Word' });
  }
};



// ---------------- EXPORT ALL QUOTES TO EXCEL ----------------
export const exportAllQuotesToExcel = async (req, res) => {
  try {
    const quotes = await Quote.find({ isDeleted: false }).populate('customerId').sort({ created: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('All Quotes');

    worksheet.columns = [
      { header: 'Quote Number', key: 'quoteNumber', width: 20 },
      { header: 'Quote Date', key: 'quoteDate', width: 15 },
      { header: 'Customer', key: 'customer', width: 25 },
      { header: 'Company', key: 'company', width: 30 },
      { header: 'Total Drawings', key: 'totalDrawings', width: 15 },
      { header: 'Total Quantity', key: 'totalQuantity', width: 15 },
      { header: 'Total Value', key: 'totalValue', width: 15 },
      { header: 'Status', key: 'status', width: 15 }
    ];

    quotes.forEach(q => {
      worksheet.addRow({
        quoteNumber: q.quoteNumber,
        quoteDate: q.quoteDate.toLocaleDateString(),
        customer: q.customerName,
        company: q.customerCompany,
        totalDrawings: q.totalDrawings,
        totalQuantity: q.totalQuantity,
        totalValue: q.totalQuoteValue,
        status: q.status
      });
    });

    worksheet.getRow(1).font = { bold: true };

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=all-quotes.xlsx`);
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('ExportAllQuotesToExcel Error:', error);
    res.status(500).json({ success: false, message: 'Error exporting all quotes', error: error.message });
  }
};
