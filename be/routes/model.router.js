const router = require("express").Router();
const { commitRecord } = require("../controllers/model.controller");

// if you want to protect it with auth middleware, add it here:
// const auth = require("../middleware/auth");
// router.post("/commit-record", auth, commitRecord);

router.post("/commit-record", commitRecord);

module.exports = router;