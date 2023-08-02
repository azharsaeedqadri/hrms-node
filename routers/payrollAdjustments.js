const express = require("express");
const {
  addPayrollItem,
  getAllPayrollRecords,
  removePayrollItem,
  addOvertime,
  addEncashedLeaves,
  addEPF
} = require("../controllers/payrollAdjustments");

const router = express.Router();

router.post("/add", addPayrollItem);

router.post("/addovertime", addOvertime);

router.post("/addleaveEncashment", addEncashedLeaves);

router.post("/addepf", addEPF);

router.post("/get", getAllPayrollRecords);

router.post("/remove", removePayrollItem);

module.exports = router;
