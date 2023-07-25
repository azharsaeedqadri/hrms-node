const express = require("express");
const {
  addPayrollItem,
  getAllPayrollRecords,
  removePayrollItem
} = require("../controllers/payrollAdjustments");

const router = express.Router();

router.post("/add", addPayrollItem);

router.post("/get", getAllPayrollRecords);

router.post("/remove", removePayrollItem);

module.exports = router;
