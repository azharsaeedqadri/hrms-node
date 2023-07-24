const express = require("express");
const {
  addReimbursement,
  getReimbursementByID,
  getAllReimbursements,
} = require("../controllers/medicalreimbursement");

const router = express.Router();

router.post("/add", addReimbursement);

router.get("/byID/:id", getReimbursementByID);

router.get("/list", getAllReimbursements);

module.exports = router;
