// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const app = express();
const port = 4000;

// Middleware
app.use(cors());

// ⚠️ Don't use express.json() before multer for upload routes
app.use(express.json()); // fine globally as long as you don't reuse it in upload routes

// ✅ Connect to MongoDB
mongoose.connect("mongodb+srv://Sridharc:007007007@cluster0.nrw42eq.mongodb.net/e-commerce")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Create upload folder if not exists
const uploadDir = path.join(__dirname, "Upload", "images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📂 Created upload directory:", uploadDir);
}

// ✅ Multer storage engine setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// ✅ Static folder for serving uploaded images
app.use("/images", express.static(uploadDir));

// ✅ Test route
app.get("/", (req, res) => {
  res.send("🚀 Express App is Running Successfully!");
});

// ✅ Upload route (expects field name "product")
app.post("/upload", (req, res, next) => {
  upload.single("product")(req, res, (err) => {
    if (err) {
      console.error("❌ Multer Error:", err);
      return res.status(400).json({ success: 0, message: "File upload error", error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ success: 0, message: "No file uploaded" });
    }

    const imageUrl = `http://localhost:${port}/images/${req.file.filename}`;
    res.json({ success: 1, image_url: imageUrl });
  });
});

// ✅ Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
