const express = require("express");
const {
  addNewDeduction,
  getAllDeductions,
  getDeductionByID,
  editDeduction,
  deleteDeduction,
} = require("../controllers/deduction");

const router = express.Router();

router.post("/addNewDeduction", addNewDeduction);
router.get("/getAll", getAllDeductions);
router.get("/:id", getDeductionByID);
router.put("/:id", editDeduction);
router.delete("/:id", deleteDeduction);

module.exports = router;
