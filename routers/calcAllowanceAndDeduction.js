const express = require("express");
const {
  getOvertime,
  getEncashedLeaves,
  getEPF,
} = require("../controllers/calcAllowanceAndDeduction");

const router = express.Router();

router.post("/overtime", getOvertime);

router.post("/leaveEncashment", getEncashedLeaves);

router.post("/epf", getEPF);

module.exports = router;
