const express = require("express");
const {
  addEPD,
  deleteEPD,
  getAllEPDs,
  editEPD,
  getEPDByID,
} = require("../controllers/employeePayDeduction");

const router = express.Router();

router.post("/addEPD", addEPD);

router.delete("/:id", deleteEPD);

router.get("/getAll", getAllEPDs);

router.put("/:id", editEPD);

router.get("/:id", getEPDByID);

module.exports = router;
