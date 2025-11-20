// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 4000;

// Middleware
app.use(cors());

// Parse JSON + urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

// MongoDB connection
mongoose.connect(
  "mongodb+srv://Sridharc:007007007@cluster0.nrw42eq.mongodb.net/ecommerce",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const Product = mongoose.model("Product", {
  name: String,
  image: String,
  category: String,
  new_price: Number,
  old_price: Number,
});

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Add product
app.post("/addproduct", async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const newProduct = new Product({
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
    });

    await newProduct.save();
    res.status(200).json({ message: "Product added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all products
app.get("/allproducts", async (req, res) => {
  try {
    const data = await Product.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching products" });
  }
});

// Upload product image
app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: "http://localhost:4000/uploads/" + req.file.filename,
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
