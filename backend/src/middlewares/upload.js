import multer from "multer";
import path from "path";
import fs from "fs";

// Root uploads directory
const uploadRoot = path.join(process.cwd(), "uploads");

// Ensure root folder exists
if (!fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot, { recursive: true });
  console.log("📁 Upload root folder created:", uploadRoot);
}

// File type validation
const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "image/jpg",
];

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Make sub-folder based on model type or field name
    const folderName = req.body.folderName || file.fieldname;
    const dest = path.join(uploadRoot, folderName);

    // Create folder if not exist
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    cb(null, dest);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  },
});

// File filter (only images/PDFs allowed)
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("❌ Invalid file type. Only images or PDFs are allowed."));
  }
};

// Export multer upload middleware
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
});
