const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8070;

/* -------------------- Middleware -------------------- */
app.use(cors());
app.use(express.json()); // built-in body parser

/* -------------------- MongoDB -------------------- */

/*mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connection successful"))
  .catch((err) => console.error("MongoDB connection error:", err)); */

  mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connection successful"))
  .catch((err) => console.error("MongoDB connection error:", err));

  //MONGODB_URL=mongodb+srv://famousfiveproject31:gg79ZAXI9vSELnAr@itpm.gsmz0.mongodb.net/?retryWrites=true&w=majority&appName=ITPM

/* -------------------- Routes -------------------- */

const authRoutes = require('./routes/auth.router');



// Users
const userRoutes = require("./routes/Users");

/* -------- API Route Prefixes (CONSISTENT) -------- */
app.use('/api/auth', authRoutes);
app.use("/api/HospitalUsers", userRoutes);

/* -------------------- Health Check -------------------- */
app.get("/", (req, res) => {
  res.send("API is running...");
});

/* -------------------- Error Handler -------------------- */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

/* -------------------- Server -------------------- */
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
