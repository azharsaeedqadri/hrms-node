const { MedicalReimbursement } = require("../models");
const { getResponse } = require("../utils/valueHelpers");

async function addReimbursement(req, res) {
  try {
    const { reimbursement_type, amount, pdf_url, employee_id } = req.body;

    if (
      reimbursement_type.trim() === "" ||
      amount === null ||
      amount === undefined ||
      pdf_url.trim() === "" ||
      !!employee_id
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
