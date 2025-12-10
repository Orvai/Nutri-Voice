const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadsRoot = path.join(__dirname, "..", "uploads");
const videoDir = path.join(uploadsRoot, "videos");

fs.mkdirSync(videoDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, videoDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".mp4";
    const safeName = file.originalname
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9.-]/g, "");
    cb(null, `exercise-${req.params.id}-${Date.now()}-${safeName}${ext}`);
  },
});

const videoUpload = multer({ storage });

module.exports = { videoUpload, uploadsRoot, videoDir };