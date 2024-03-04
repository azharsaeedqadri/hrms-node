const express = require("express");
const {
  getAllDropdownData,
  getDashboardData,
} = require("../controllers/dropdownData");

const router = express.Router();

router.get("/getAll", getAllDropdownData);

router.get("/dashboard", getDashboardData);

module.exports = router;
