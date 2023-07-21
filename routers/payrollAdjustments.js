const express = require("express");
const {
  addPayrollItem,
  getAllPayrollRecords,
  removePayrollItem,
  removeSingleEmployeePayroll
} = require("../controllers/payrollAdjustments");

const router = express.Router();

router.post("/add", addPayrollItem);

router.post("/get", getAllPayrollRecords);

router.post("/remove", removePayrollItem);

router.post("/removesingle", removeSingleEmployeePayroll);

module.exports = router;
