const express = require("express");
const {
  addCompany,
  getCompanies,
  editCompany,
  getCompanyByID,
  deleteCompany,
} = require("../controllers/company");

const router = express.Router();

router.post("/add", addCompany);

router.get("/getAll", getCompanies);

router.put("/:id", editCompany);

router.get("/:id", getCompanyByID);

router.delete("/:id", deleteCompany);

module.exports = router;
