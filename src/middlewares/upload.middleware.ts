/**
 * Change Log
 * 2025-11-12: Create multer middleware for file uploads. (ThaiNQ)
 * 2025-11-12: Implement dynamic folder routing based on fieldname or query parameter. (ThaiNQ)
 * 2025-11-12: Add filename sanitization and unique naming. (ThaiNQ)
 */
import multer from "multer";
import { Request } from "express";
import path from "path";
import { ensureUploadDir } from "../utils/fileUpload";

// Configure multer for disk storage with dynamic folders
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Get folder from query parameter or determine from field name
    let folder = (req.query.folder as string) || "";
    // Sanitize folder input to prevent path traversal
    folder = folder.replace(/(\.\.[\/\\]|[\\\/])/g, "");

    // If no folder in query, determine from field name
    if (!folder) {
      if (file.fieldname === "logo") {
        folder = "brands";
      } else if (file.fieldname === "thumbnail") {
        folder = "products/thumbnails";
      } else if (file.fieldname === "additionalImages") {
        folder = "products/additional";
      } else if (file.fieldname === "image" || file.fieldname === "images") {
        // For generic upload endpoints
        folder = "others";
      } else {
        folder = "others";
      }
    }

    // Ensure directory exists
    ensureUploadDir(folder);

    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || ".jpg"; // Ensure extension
    const basename = path
      .basename(file.originalname, ext)
      .replace(/[^a-z0-9]/gi, "-")
      .toLowerCase();
    const filename = basename + "-" + uniqueSuffix + ext;
    console.log(
      "Generated filename:",
      filename,
      "from originalname:",
      file.originalname
    );
    cb(null, filename);
  },
}); // File filter for images only
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Accept images only
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

// Multer upload instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});
