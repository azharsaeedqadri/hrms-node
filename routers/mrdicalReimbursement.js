const express = require("express");
const {
  addReimbursement,
  getReimbursementByID,
  getAllReimbursements,
  getReimbursementDetailsByEmpID,
  updateStatus,
  addMedicalLimits,
  getMedicalLimits,
  updateMedicalLimits,
  getMedicalClaimsHistory,
} = require("../controllers/medicalreimbursement");

const router = express.Router();

router.post("/add", addReimbursement);

router.get("/byID/:id", getReimbursementByID);

router.get("/list", getAllReimbursements);

router.get("/empID/:id", getReimbursementDetailsByEmpID);

router.put("/statusUpdate/:id", updateStatus);

router.post("/limits/add", addMedicalLimits);

router.get("/limits/get", getMedicalLimits);

router.put("/limits/update/:id", updateMedicalLimits);

router.post("/history", getMedicalClaimsHistory);

module.exports = router;
