const express = require("express");
const {
  addEPA,
  deleteEPA,
  getAllEPAs,
  editEPA,
  getEPAByID,
} = require("../controllers/employeePayAllowance");

const router = express.Router();

router.post("/addEPA", addEPA);

router.delete("/:id", deleteEPA);

router.get("/getAll", getAllEPAs);

router.put("/:id", editEPA);

router.get("/:id", getEPAByID);

module.exports = router;
