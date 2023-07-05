const express = require("express");
const {
  addRecord,
  getLeavesRequestList,
  getLeaveRecordsByEmployeeID,
  getLeaveRecordsByLeaveID,
  updateLeaveStatus,
  addReasonAndUpdateLeaveDates,
  getLeaveReasonsByLeaveID,
  cancelLeaveRequest,
} = require("../controllers/leavesRecord");

const router = express.Router();

router.post("/addLeave", addRecord);

router.get("/getAll", getLeavesRequestList);

router.get("/:id", getLeaveRecordsByEmployeeID);

router.get("/leaveID/:id", getLeaveRecordsByLeaveID);

router.put("/:id", updateLeaveStatus);

router.post("/addReason", addReasonAndUpdateLeaveDates);

router.get("/reasons/:id", getLeaveReasonsByLeaveID);

router.put("/cancel/:id", cancelLeaveRequest);

module.exports = router;
