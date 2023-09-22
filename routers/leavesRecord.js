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
  getLeavesHistory,
} = require("../controllers/leavesRecord");

const router = express.Router();

router.post("/addLeave", addRecord);

router.get("/getAll", getLeavesRequestList);

router.get("/emp/:id", getLeaveRecordsByEmployeeID);

router.get("/leaveID/:id", getLeaveRecordsByLeaveID);

router.put("/:id", updateLeaveStatus);

router.post("/addReason", addReasonAndUpdateLeaveDates);

router.get("/reasons/:id", getLeaveReasonsByLeaveID);

router.put("/cancel/:id", cancelLeaveRequest);

router.post("/history", getLeavesHistory);

module.exports = router;
