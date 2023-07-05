const express = require("express");
const {
  addNewAllowance,
  getAllAllowances,
  getAllowanceByID,
  editAllowance,
  deleteAllowance,
  getPermanentAllowances,
} = require("../controllers/allowance");

const router = express.Router();

router.post("/addNewAllowance", addNewAllowance);
router.get("/getAll", getAllAllowances);
router.get("/:id", getAllowanceByID);
router.put("/:id", editAllowance);
router.delete("/:id", deleteAllowance);
router.get("/permanentAllowances/all", getPermanentAllowances);

module.exports = router;
