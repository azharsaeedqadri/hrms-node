const {
  EmployeeLeavesRecord,
  HrUser,
  LeaveReason,
  EmployeeInformation,
  MedicalLimit,
} = require("../models");
const db = require("../models");
const { QueryTypes } = require("sequelize");
const {
  getResponse,
  getUserIDByBearerToken,
} = require("../utils/valueHelpers");
const {
  HR,
  TOTAL_LEAVES,
  GET_LEAVES_REQUEST_LIST_QUERY,
  LEAVE_RECORD_BY_EMPLOYEE_ID_QUERY,
  LEAVE_RECORD_BY_LEAVE_ID_QUERY,
  LEAVE_REASONS_BY_LEAVE_ID_QUERY,
  SUPER_ADMIN,
  GET_LEAVES_HISTORY_QUERY_FOR_SUPER_ADMIN,
  GET_LEAVES_HISTORY_QUERY,
} = require("../utils/constants");

async function addRecord(req, res) {
  try {
    const {
      employee_id,
      leave_type_id,
      from_date,
      to_date,
      no_of_days,
      attachment,
      reason,
    } = req.body;

    const employee = await EmployeeInformation.findByPk(employee_id);

    const { leave_balance } = employee;

    if (leave_balance <= 0) {
      const resp = getResponse(
        null,
        400,
        "You have consumed all of your allowed leaves."
      );
      return res.send(resp);
    }

    const createdRecord = await EmployeeLeavesRecord.create({
      employee_id,
      leave_type_id,
      from_date,
      to_date,
      no_of_days,
      attachment,
      reason,
    });

    const resp = getResponse(createdRecord, 200, "Leave Record added");

    res.status(200).send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    res.send(resp);
  }
}

async function getLeavesRequestList(req, res) {
  try {
    const token = req.header("authorization").split("Bearer ");

    const userID = getUserIDByBearerToken(token[1]);

    const adminUser = await HrUser.findByPk(userID);

    if (adminUser.role === HR) {
      const HRList = await db.sequelize.query(GET_LEAVES_REQUEST_LIST_QUERY, {
        type: QueryTypes.SELECT,
        replacements: {
          statusType: 2,
        },
      });

      const resp = getResponse(HRList, 200, "Fetched list successfully");

      return res.send(resp);
    }

    const PMlist = await db.sequelize.query(GET_LEAVES_REQUEST_LIST_QUERY, {
      type: QueryTypes.SELECT,
      replacements: {
        statusType: 1,
      },
    });

    const resp = getResponse(PMlist, 200, "Fetched list successfully");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    res.send(resp);
  }
}

async function getLeaveRecordsByEmployeeID(req, res) {
  try {
    const employeeID = parseInt(req.params.id);

    const employeeTotalLeaveRequests = await db.sequelize.query(
      LEAVE_RECORD_BY_EMPLOYEE_ID_QUERY,
      {
        type: QueryTypes.SELECT,
        replacements: {
          employeeID,
        },
      }
    );

    if (!employeeTotalLeaveRequests.length) {
      const resp = getResponse({}, 200, "No requests found");
      return res.status(200).send(resp);
    }

    const resp = getResponse(employeeTotalLeaveRequests, 200, "success");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    res.send(resp);
  }
}

async function getLeaveRecordsByLeaveID(req, res) {
  try {
    const leaveID = parseInt(req.params.id);

    const leaveRecord = await db.sequelize.query(
      LEAVE_RECORD_BY_LEAVE_ID_QUERY,
      {
        type: QueryTypes.SELECT,
        replacements: {
          leaveID,
        },
      }
    );

    if (!leaveRecord.length) {
      const resp = getResponse(null, 200, "No request found");
      return res.status(200).send(resp);
    }

    const reasonsList = await db.sequelize.query(
      LEAVE_REASONS_BY_LEAVE_ID_QUERY,
      {
        type: QueryTypes.SELECT,
        replacements: {
          leaveID,
        },
      }
    );

    const respData = {
      ...leaveRecord[0],
      reasonsList: reasonsList || "No reasons found for this leave",
    };

    const resp = getResponse(respData, 200, "success");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    res.send(resp);
  }
}

async function updateLeaveStatus(req, res) {
  try {
    const token = req.header("authorization").split("Bearer ");

    const userID = getUserIDByBearerToken(token[1]);

    const leaveID = parseInt(req.params.id);
    const { status_type_id, reason, user_id, employee_id, no_of_days } =
      req.body;

    // status type id 4 is for rejected leave
    if (status_type_id === 4) {
      LeaveReason.create({
        user_id,
        leave_id: leaveID,
        reason,
      });
    }

    // status type id 3 is for granted leaves
    if (status_type_id === 3) {
      const employee = await EmployeeInformation.findByPk(employee_id);

      const { leave_balance } = employee;
      const updatedLeaveBalance = leave_balance - no_of_days;

      await EmployeeInformation.update(
        {
          leave_balance: updatedLeaveBalance,
        },
        { where: { employee_id } }
      );
    }

    await EmployeeLeavesRecord.update(
      { status_type_id, approved_by: userID },
      { where: { id: leaveID } }
    );

    const updatedLeaveRecord = await db.sequelize.query(
      LEAVE_RECORD_BY_LEAVE_ID_QUERY,
      {
        type: QueryTypes.SELECT,
        replacements: {
          leaveID,
        },
      }
    );

    const resp = getResponse(
      updatedLeaveRecord,
      200,
      "status successfully updated"
    );

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    res.send(resp);
  }
}

async function addReasonAndUpdateLeaveDates(req, res) {
  try {
    const {
      user_id,
      leave_id: leaveID,
      reason,
      to_date,
      from_date,
      no_of_days,
    } = req.body;

    await LeaveReason.create({
      user_id,
      leave_id: leaveID,
      reason,
    });

    await EmployeeLeavesRecord.update(
      {
        to_date,
        from_date,
        no_of_days,
      },
      {
        where: {
          id: leaveID,
        },
      }
    );

    const leaveRecord = await db.sequelize.query(
      LEAVE_RECORD_BY_LEAVE_ID_QUERY,
      {
        type: QueryTypes.SELECT,
        replacements: {
          leaveID,
        },
      }
    );

    if (!leaveRecord.length) {
      const resp = getResponse({}, 200, "No request found");
      return res.status(200).send(resp);
    }

    const resp = getResponse(leaveRecord[0], 200, "success");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    res.send(resp);
  }
}

async function getLeaveReasonsByLeaveID(req, res) {
  try {
    const leaveID = parseInt(req.params.id);

    const reasonsList = await db.sequelize.query(
      LEAVE_REASONS_BY_LEAVE_ID_QUERY,
      {
        type: QueryTypes.SELECT,
        replacements: {
          leaveID,
        },
      }
    );

    if (!reasonsList.length) {
      const resp = getResponse({}, 404, "No reasons found");
      return res.send(resp);
    }

    const resp = getResponse(reasonsList, 200, "success");
    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    res.send(resp);
  }
}

async function cancelLeaveRequest(req, res) {
  try {
    const leaveID = parseInt(req.params.id);

    const requestToCancel = await EmployeeLeavesRecord.findByPk(leaveID);

    if (!requestToCancel) {
      const resp = getResponse({}, 401, "No leave found");
      return res.send(resp);
    }

    await EmployeeLeavesRecord.update(
      {
        status_type_id: 5,
      },
      {
        where: {
          id: leaveID,
        },
      }
    );

    const cancelledRequest = await db.sequelize.query(
      LEAVE_RECORD_BY_LEAVE_ID_QUERY,
      {
        type: QueryTypes.SELECT,
        replacements: {
          leaveID,
        },
      }
    );

    const resp = getResponse(
      cancelledRequest,
      200,
      "Leave cancelled successfully"
    );

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    res.send(resp);
  }
}

// Cron Job function for resetting employees leave balance
async function leaveBalanceCronJob() {
  try {
    const medical_limits = await MedicalLimit.findAll();

    const { ipd_limit, opd_limit } = medical_limits[0];

    // Reset leaves and medical limits for all employees
    await EmployeeInformation.update(
      {
        leave_balance: TOTAL_LEAVES,
        ipd_balance: ipd_limit,
        opd_balance: opd_limit,
      },
      { where: {} }
    );
    console.log("Leaves reset for all employees.");
  } catch (error) {
    console.error("Error resetting leaves:", error);
  }
}

async function getLeavesHistory(req, res) {
  try {
    const token = req.header("authorization").split("Bearer ");

    const userID = getUserIDByBearerToken(token[1]);

    const adminUser = await HrUser.findByPk(userID);

    const { startDate, endDate, statusType } = req.body;

    if (adminUser.role === SUPER_ADMIN) {
      const leavesHistoryList = await db.sequelize.query(
        GET_LEAVES_HISTORY_QUERY_FOR_SUPER_ADMIN,
        {
          type: QueryTypes.SELECT,
          replacements: {
            statusType,
            startDate,
            endDate,
          },
        }
      );

      const resp = getResponse(leavesHistoryList, 200, "success");
      return res.send(resp);
    }

    const leavesHistoryList = await db.sequelize.query(
      GET_LEAVES_HISTORY_QUERY,
      {
        type: QueryTypes.SELECT,
        replacements: {
          statusType: statusType,
          startDate,
          endDate,
          updatedBy: userID,
        },
      }
    );

    const resp = getResponse(leavesHistoryList, 200, "success");
    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    console.error(err);
    res.send(resp);
  }
}

module.exports = {
  addRecord,
  getLeavesRequestList,
  getLeaveRecordsByEmployeeID,
  getLeaveRecordsByLeaveID,
  updateLeaveStatus,
  addReasonAndUpdateLeaveDates,
  getLeaveReasonsByLeaveID,
  cancelLeaveRequest,
  leaveBalanceCronJob,
  getLeavesHistory,
};
