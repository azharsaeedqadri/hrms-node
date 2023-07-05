const express = require("express");
const {
  getAllUsers,
  addUser,
  portalLogin,
  mobileLogin,
  updateAdminPassword,
  updateAdminInfo,
} = require("../controllers/user");

const router = express.Router();

router.get("/", getAllUsers);

router.post("/addUser", addUser);

router.post("/updatePassword", updateAdminPassword);

router.put("/updateAdminInfo", updateAdminInfo);

router.post("/portalLogin", portalLogin);

router.post("/mobileLogin", mobileLogin);

module.exports = router;
