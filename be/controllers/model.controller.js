const IllnessRecord = require("../models/IllnessRecord");

// POST /api/model/commit-record
const commitRecord = async (req, res) => {
  try {
    const { date, disease, severity, cases, department, ageGroup, granularity } = req.body;

    if (!date || !disease || cases === undefined || !department) {
      return res.status(400).json({ message: "Missing required fields: date, disease, cases, department" });
    }

    const casesNum = Number(cases);
    if (!Number.isFinite(casesNum) || casesNum < 0) {
      return res.status(400).json({ message: "cases must be a valid number >= 0" });
    }

    const doc = await IllnessRecord.create({
      date,
      disease,
      severity: severity || "Medium",
      cases: casesNum,
      department,
      ageGroup: ageGroup || "All Ages",
      granularity: granularity || "Weekly",
    });

    // ✅ Later you can trigger model retraining async here (queue/job)
    // e.g. trainService.enqueue();

    return res.status(201).json({
      ok: true,
      message: "Record saved to MongoDB successfully",
      id: doc._id,
    });

  } catch (err) {
    console.error("commitRecord error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { commitRecord };