const express = require("express");
const {
  addReimbursement,
  getReimbursementByID,
  getAllReimbursements,
  getReimbursementDetailsByEmpID,
  updateStatus,
} = require("../controllers/medicalreimbursement");

const router = express.Router();

router.post("/add", addReimbursement);

router.get("/byID/:id", getReimbursementByID);

router.get("/list", getAllReimbursements);

router.get("/empID/:id", getReimbursementDetailsByEmpID);

router.put("/statusUpdate/:id", updateStatus);

module.exports = router;
