const mongoose = require("mongoose");

const illnessRecordSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // keep String (yyyy-mm-dd). If you want Date type, tell me.
    disease: { type: String, required: true, trim: true },
    severity: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    cases: { type: Number, required: true, min: 0 },
    department: { type: String, required: true },
    ageGroup: { type: String, default: "All Ages" },
    granularity: { type: String, default: "Weekly" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("IllnessRecord", illnessRecordSchema);