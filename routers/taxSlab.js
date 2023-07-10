const express = require("express");
const {
  getAllTaxSlabs,
  addTaxSlab,
  editTaxSlab,
  deleteTaxSlab,
  getTaxSlabByID,
} = require("../controllers/taxSlab");

const router = express.Router();

router.get("/slabs/all", getAllTaxSlabs);

router.post("/add", addTaxSlab);

router.put("/:id", editTaxSlab);

router.delete("/:id", deleteTaxSlab);

router.get("/:id", getTaxSlabByID);

module.exports = router;
