const express = require("express");
const {
  addNewEmployee,
  getAllEmployees,
  getEmployeeByID,
  editEmployeeInformation,
  updateEmployeeStatus,
  employeeListForCalendar,
  getEmployeeLogsForMobile,
} = require("../controllers/employee");

const router = express.Router();

router.post("/addNewEmployee", addNewEmployee);
router.get("/getAll", getAllEmployees);
router.get("/getEmployeeRecordForCalender", employeeListForCalendar);
router.get("/:id", getEmployeeByID);
router.put("/:id", editEmployeeInformation);
router.post("/updateStatus", updateEmployeeStatus);
router.get("/mobile/logs/:id", getEmployeeLogsForMobile);

module.exports = router;
