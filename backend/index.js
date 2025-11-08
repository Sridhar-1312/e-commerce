const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://Sridharc:007007007@cluster0.nrw42eq.mongodb.net/e-commerce")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// API Test
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

// Image Storage Engine
const storage = multer.diskStorage({
  destination: './Upload/images', // lowercase folder name
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// Static folder
app.use('/images', express.static('Upload/images'));

// Upload Endpoint
app.post("/upload", upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  });
});

// Start Server
app.listen(port, (error) => {
  if (!error) {
    console.log("🚀 Server running on port " + port);
  } else {
    console.log("❌ Error: " + error);
  }
});
