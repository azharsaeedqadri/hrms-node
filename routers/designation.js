const express = require("express");
const {
  addDesignation,
  getDesignations,
  editDesignation,
  getDesignationByID,
} = require("../controllers/designation");

const router = express.Router();

router.post("/add", addDesignation);

router.get("/getAll", getDesignations);

router.put("/:id", editDesignation);

router.get("/:id", getDesignationByID);

module.exports = router;
