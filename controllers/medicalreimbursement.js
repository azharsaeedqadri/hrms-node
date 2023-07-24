const { MedicalReimbursement, EmployeeInformation } = require("../models");
const { getResponse } = require("../utils/valueHelpers");

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
      include: EmployeeInformation,
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
      include: EmployeeInformation,
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

module.exports = {
  addReimbursement,
  getReimbursementByID,
  getAllReimbursements,
};
