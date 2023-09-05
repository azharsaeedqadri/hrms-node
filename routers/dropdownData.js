const express = require("express");
const {
  getAllDropdownData,
  getDashboardData,
  getDashboardDataByEmpID,
} = require("../controllers/dropdownData");

const router = express.Router();

router.get("/getAll", getAllDropdownData);

router.get("/dashboard", getDashboardData);

router.get("/mobEmp/:id", getDashboardDataByEmpID);

module.exports = router;
