const express = require("express");
const { addReimbursement } = require("../controllers/medicalreimbursement");

const router = express.Router();

router.post("/add", addReimbursement);

module.exports = router;
