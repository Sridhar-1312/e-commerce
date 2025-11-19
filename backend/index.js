// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const { type } = require("os");

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

// schema bfor creating product

const Product = mongoose.model("Product",{
  id:{
    type:Number,
    required:true,
  },
  name:{
    type:String,
    required:true,
  },
  image:{
    type:String,
    required:true,
  },
  category:{
    type:String,
    required:true,
  },
  new_price:{
    type:Number,
    required:true,
  },
  old_price:{
    type:Number,
    required:false,
  },
  date:{
    type:Date,
    default:Date.now,
  },
  available:{
    type:Boolean,
    default:true,
  },
})

app.post("/addproduct",async(req,res)=>{
  let products = await Product.find({});
  let id;
  if(products.length>0){
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  }
  else{
    id = 1;
  }
  const product = new Product({
    id:id,
    name:req.body.name,
    image:req.body.image,
    category:req.body.category,
    new_price:req.body.new_price,
    old_price:req.body.old_price,
    date:req.body.date,
    available:req.body.available,
  });
  console.log(product);
  await product.save();
  console.log("Saved");
  res.json({
    success: true,
    name:req.body.name,
  })
  
  
  
})
//Creaing API for deleting product

app.post('/removeproduct', async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({ id: req.body.id });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    console.log("Removed", deleted.id);
    res.json({
      success: true,
      id: deleted.id,
    });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

//creating API for getting all products

app.get('/allproduct', async)

// ✅ Start server
app.listen(port, (error) => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
