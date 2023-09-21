const express = require("express");
const {
  getAllUsers,
  addUser,
  portalLogin,
  mobileLogin,
  updateAdminPassword,
  updateAdminInfo,
  updateAdminsBySuperUser,
  updateStatusBySuperAdmin,
} = require("../controllers/user");

const router = express.Router();

router.get("/", getAllUsers);

router.post("/addUser", addUser);

router.post("/updatePassword", updateAdminPassword);

router.put("/updateAdminInfo", updateAdminInfo);

router.post("/portalLogin", portalLogin);

router.post("/mobileLogin", mobileLogin);

router.put("/updatedBySA/:id", updateAdminsBySuperUser);

router.put("/activeStatusUpdateBySA/:id", updateStatusBySuperAdmin);

module.exports = router;
