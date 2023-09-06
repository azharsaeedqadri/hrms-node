const express = require("express");
const {
  addPayrollItem,
  getAllPayrollRecords,
  removePayrollItem,
  addOvertime,
  addEncashedLeaves,
  addEPF,
  calculatePayroll,
  runPayroll,
  getEmployeePayrollDetails,
  updateEmployeePayrollDetails,
  checkPayrollStatus
} = require("../controllers/payrollAdjustments");

const router = express.Router();

router.post("/add", addPayrollItem);

router.post("/addovertime", addOvertime);

router.post("/addleaveEncashment", addEncashedLeaves);

router.post("/addepf", addEPF);

router.post("/get", getAllPayrollRecords);

router.post("/remove", removePayrollItem);

router.post("/calc", calculatePayroll);

router.post("/run", runPayroll);

router.post("/getdetails", getEmployeePayrollDetails);

router.post("/updatedetails", updateEmployeePayrollDetails);

router.post("/checkstatus", checkPayrollStatus);


module.exports = router;
