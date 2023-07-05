const { EmployeePayDeduction } = require("../models");
const { getResponse } = require("../utils/valueHelpers");

async function addEPD(req, res) {
  try {
    const { pay_master_id, deduction_id, deduction_type, total_deductions } =
      req.body;

    await EmployeePayDeduction.create({
      pay_master_id,
      deduction_id,
      deduction_type,
      total_deductions,
    });

    const addedEPA = await EmployeePayDeduction.findOne({
      where: { pay_master_id, deduction_id },
    });

    const resp = getResponse(addedEPA, 200, "Success");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err.message);
    console.error(err);
    res.send(resp);
  }
}

async function editEPD(req, res) {
  try {
    const values = req.body;

    const epd_id = parseInt(req.params.id);

    await EmployeePayDeduction.update(values, {
      where: { epd_id },
    });

    const updatedEPD = await EmployeePayDeduction.findByPk(epd_id);

    const resp = getResponse(updatedEPD, 200, "Update success");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err.message);
    console.error(err);
    res.send(resp);
  }
}

async function getAllEPDs(req, res) {
  try {
    const allEPDs = await EmployeePayDeduction.findAll();

    if (!allEPDs.length) {
      const resp = getResponse(null, 404, "Not Found");
      return res.send(resp);
    }

    const resp = getResponse(allEPDs, 200, "Success");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err.message);
    console.error(err);
    res.send(resp);
  }
}

async function getEPDByID(req, res) {
  try {
    const epd_id = parseInt(req.params.id);

    const epd = await EmployeePayDeduction.findByPk(epd_id);

    const resp = getResponse(epd, 200, "Success");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err.message);
    console.error(err);
    res.send(resp);
  }
}

async function deleteEPD(req, res) {
  try {
    const epd_id = parseInt(req.params.id);

    const deletedEPD = await EmployeePayDeduction.destroy({
      where: { epd_id },
    });

    const resp = getResponse(deletedEPD, 200, "Success");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err.message);
    console.error(err);
    res.send(resp);
  }
}

module.exports = {
  addEPD,
  editEPD,
  getAllEPDs,
  getEPDByID,
  deleteEPD,
};
