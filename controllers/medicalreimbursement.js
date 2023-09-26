const {
  MedicalReimbursement,
  EmployeeInformation,
  StatusType,
  MedicalLimit,
  HrUser,
} = require("../models");
const db = require("../models");
const moment = require("moment");
const { QueryTypes } = require("sequelize");
const {
  SUPER_ADMIN,
  GET_MEDICAL_CLAIMS_HISTORY_QUERY_FOR_ADMIN,
  GET_MEDICAL_CLAIMS_HISTORY_QUERY,
  GET_MEDICAL_CLAIMS_HISTORY_QUERY_FOR_ADMIN_WITHOUT_REQ_BODY,
  GET_MEDICAL_CLAIMS_HISTORY_QUERY_WITHOUT_REQ_BODY,
} = require("../utils/constants");
const {
  getResponse,
  getUserIDByBearerToken,
} = require("../utils/valueHelpers");

async function addReimbursement(req, res) {
  try {
    const { reimbursement_type, amount, pdf_url, employee_id } = req.body;

    if (
      reimbursement_type.trim() === "" ||
      amount === null ||
      amount === undefined ||
      pdf_url.trim() === "" ||
      !employee_id
    ) {
      const resp = getResponse(null, 400, "Provide all required data");
      return res.send(resp);
    }

    const employee = await EmployeeInformation.findByPk(employee_id);

    if (reimbursement_type === "IPD" && amount > employee.ipd_balance) {
      const resp = getResponse(null, 400, "Amount is greater than IPD balance");
      return res.send(resp);
    }

    if (reimbursement_type === "OPD" && amount > employee.opd_balance) {
      const resp = getResponse(null, 400, "Amount is greater than OPD balance");
      return res.send(resp);
    }

    const addedReimbursement = await MedicalReimbursement.create({
      reimbursement_type,
      amount,
      pdf_url,
      employee_id,
    });

    const resp = getResponse(
      addedReimbursement,
      200,
      "Added Reimbursement successfully"
    );

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, "Something went wrong.");
    console.error(err);
    res.send(resp);
  }
}

async function getReimbursementByID(req, res) {
  try {
    const reimbursementID = parseInt(req.params.id);

    const reimbursement = await MedicalReimbursement.findByPk(reimbursementID, {
      include: [{ model: StatusType }, { model: EmployeeInformation }],
    });

    const resp = getResponse(reimbursement, 200, "Success");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, "Something went wrong.");
    console.error(err);
    res.send(resp);
  }
}

async function getAllReimbursements(req, res) {
  try {
    const reimbursements = await MedicalReimbursement.findAll({
      where: {
        status: 1,
      },
      include: [{ model: StatusType }, { model: EmployeeInformation }],
    });

    if (!reimbursements.length) {
      const resp = getResponse(null, 404, "Not Found");
      return res.send(resp);
    }

    const resp = getResponse(reimbursements, 200, "success");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, "Something went wrong.");
    console.error(err);
    res.send(resp);
  }
}

async function getReimbursementDetailsByEmpID(req, res) {
  try {
    const empID = parseInt(req.params.id);

    const allEmpReimbursements = await MedicalReimbursement.findAll(
      { include: [{ model: StatusType }, { model: EmployeeInformation }] },
      { where: { employee_id: empID } }
    );

    if (!allEmpReimbursements.length) {
      const resp = getResponse(
        null,
        404,
        "No medical reimbursements submitted"
      );
      return res.send(resp);
    }

    const resp = getResponse(allEmpReimbursements, 200, "success");
    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, "Something went wrong.");
    console.error(err);
    res.send(resp);
  }
}

async function updateStatus(req, res) {
  try {
    const token = req.header("authorization").split("Bearer ");

    const userID = getUserIDByBearerToken(token[1]);
    const reimbursementID = parseInt(req.params.id);
    const { status, type, amount, employee_id } = req.body;

    await MedicalReimbursement.update(
      { status, updated_by: userID },
      { where: { id: reimbursementID } }
    );

    // status 2 is for approved status
    if (status === 2 && type === "IPD") {
      const emp = await EmployeeInformation.findByPk(employee_id);
      const updatedIpdBalance = emp.ipd_balance - amount;

      await EmployeeInformation.update({ ipd_balance: updatedIpdBalance });
    }

    // status 2 is for approved status
    if (status === 2 && type === "OPD") {
      const emp = await EmployeeInformation.findByPk(employee_id);
      const updatedOpdBalance = emp.opd_balance - amount;

      await EmployeeInformation.update(
        { opd_balance: updatedOpdBalance },
        { where: { employee_id } }
      );
    }

    const updatedReimbursement = await MedicalReimbursement.findByPk(
      reimbursementID,
      {
        include: [{ model: StatusType }, { model: EmployeeInformation }],
      }
    );

    const resp = getResponse(
      updatedReimbursement,
      200,
      "Status changed successfully"
    );
    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, "Something went wrong.");
    console.error(err);
    res.send(resp);
  }
}

async function addMedicalLimits(req, res) {
  try {
    const { ipd_limit, opd_limit } = req.body;

    const createdLimit = await MedicalLimit.create({ ipd_limit, opd_limit });

    const resp = getResponse(createdLimit, 200, "Limits created successfully");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, "Something went wrong");
    console.error(err);
    res.send(resp);
  }
}

async function getMedicalLimits(req, res) {
  try {
    const medicalLimits = await MedicalLimit.findAll();

    if (!medicalLimits.length) {
      const resp = getResponse([], 404, "Not found");
      return res.send(resp);
    }

    const resp = getResponse(medicalLimits);

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, "Something went wrong");
    console.error(err);
    res.send(resp);
  }
}

async function updateMedicalLimits(req, res) {
  try {
    const limitID = parseInt(req.params.id);
    const values = req.body;

    const updatedLimits = await MedicalLimit.update(values, {
      where: { id: limitID },
    });

    const resp = getResponse(updatedLimits, 200, "Updated successfully");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, "Something went wrong");
    console.error(err);
    res.send(resp);
  }
}

async function getMedicalClaimsHistory(req, res) {
  try {
    const token = req.header("authorization").split("Bearer ");

    const userID = getUserIDByBearerToken(token[1]);

    const adminUser = await HrUser.findByPk(userID);

    const { startDate, endDate, statusType } = req.body;

    if (
      !startDate ||
      !endDate ||
      startDate.trim() === "" ||
      endDate.trim() === "" ||
      !statusType
    ) {
      const currentDate = moment();

      firstDate = currentDate
        .clone()
        .startOf("month")
        .format("YYYY-MM-DDTHH:mm:ss.SSS");
      lastDate = currentDate
        .clone()
        .endOf("month")
        .format("YYYY-MM-DDTHH:mm:ss.SSS");

      if (adminUser.role === SUPER_ADMIN) {
        const medicalClaimsHistoryList = await db.sequelize.query(
          GET_MEDICAL_CLAIMS_HISTORY_QUERY_FOR_ADMIN_WITHOUT_REQ_BODY,
          {
            type: QueryTypes.SELECT,
            replacements: {
              startDate: firstDate,
              endDate: lastDate,
            },
          }
        );

        const resp = getResponse(medicalClaimsHistoryList, 200, "success");
        return res.send(resp);
      }

      const medicalClaimsHistoryList = await db.sequelize.query(
        GET_MEDICAL_CLAIMS_HISTORY_QUERY_WITHOUT_REQ_BODY,
        {
          type: QueryTypes.SELECT,
          replacements: {
            startDate: firstDate,
            endDate: lastDate,
            updatedBy: userID,
          },
        }
      );

      const resp = getResponse(medicalClaimsHistoryList, 200, "success");
      return res.send(resp);
    }

    if (adminUser.role === SUPER_ADMIN) {
      const medicalClaimsHistoryList = await db.sequelize.query(
        GET_MEDICAL_CLAIMS_HISTORY_QUERY_FOR_ADMIN,
        {
          type: QueryTypes.SELECT,
          replacements: {
            statusType,
            startDate,
            endDate,
          },
        }
      );

      const resp = getResponse(medicalClaimsHistoryList, 200, "success");
      return res.send(resp);
    }

    const medicalClaimsHistoryList = await db.sequelize.query(
      GET_MEDICAL_CLAIMS_HISTORY_QUERY,
      {
        type: QueryTypes.SELECT,
        replacements: {
          statusType,
          startDate,
          endDate,
          userID,
        },
      }
    );

    const resp = getResponse(medicalClaimsHistoryList, 200, "success");
    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, "Something went wrong");
    console.error(err);
    res.send(resp);
  }
}

module.exports = {
  addReimbursement,
  getReimbursementByID,
  getAllReimbursements,
  getReimbursementDetailsByEmpID,
  updateStatus,
  addMedicalLimits,
  getMedicalLimits,
  updateMedicalLimits,
  getMedicalClaimsHistory,
};
