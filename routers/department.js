const express = require("express");
const {
  addDepartment,
  getDepartments,
  editDepartment,
  getDepartmentByID,
} = require("../controllers/department");

const router = express.Router();

router.post("/add", addDepartment);

router.get("/getAll", getDepartments);

router.put("/:id", editDepartment);

router.get("/:id", getDepartmentByID);

module.exports = router;
