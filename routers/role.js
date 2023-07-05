const express = require("express");
const { addRoleType, getRoleTypes, editRole, getRoleTypeByID, deleteRole } = require("../controllers/role");

const router = express.Router();

router.post("/add", addRoleType);

router.get("/getAll", getRoleTypes);

router.put("/:id", editRole);

router.get("/:id", getRoleTypeByID);

router.delete("/:id", deleteRole);
module.exports = router;
