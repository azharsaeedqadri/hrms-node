const { EmployeePayAllowance } = require("../models");
const { getResponse } = require("../utils/valueHelpers");

async function addEPA(req, res) {
  try {
    const {
      pay_master_id,
      allowance_id,
      allowance_type,
      is_fixed,
      allowance_amount,
    } = req.body;

    await EmployeePayAllowance.create({
      pay_master_id,
      allowance_id,
      allowance_type,
      is_fixed,
      allowance_amount,
    });

    const addedEPA = await EmployeePayAllowance.findOne({
      where: { pay_master_id, allowance_id },
    });

    const resp = getResponse(addedEPA, 200, "Success");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err.message);
    console.error(err);
    res.send(resp);
  }
}

async function editEPA(req, res) {
  try {
    const values = req.body;

    const epa_id = parseInt(req.params.id);

    await EmployeePayAllowance.update(values, {
      where: { epa_id },
    });

    const updatedEPA = await EmployeePayAllowance.findByPk(epa_id);

    const resp = getResponse(updatedEPA, 200, "Update success");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err.message);
    console.error(err);
    res.send(resp);
  }
}

async function getAllEPAs(req, res) {
  try {
    const allEPAs = await EmployeePayAllowance.findAll();

    if (!allEPAs.length) {
      const resp = getResponse(null, 404, "Not Found");
      return res.send(resp);
    }

    const resp = getResponse(allEPAs, 200, "Success");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err.message);
    console.error(err);
    res.send(resp);
  }
}

async function getEPAByID(req, res) {
  try {
    const epa_id = parseInt(req.params.id);

    const epa = await EmployeePayAllowance.findByPk(epa_id);

    const resp = getResponse(epa, 200, "Success");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err.message);
    console.error(err);
    res.send(resp);
  }
}

async function deleteEPA(req, res) {
  try {
    const epa_id = parseInt(req.params.id);

    const deletedEPA = await EmployeePayAllowance.destroy({
      where: { epa_id },
    });

    const resp = getResponse(deletedEPA, 200, "Success");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err.message);
    console.error(err);
    res.send(resp);
  }
}

module.exports = {
  addEPA,
  editEPA,
  getAllEPAs,
  getEPAByID,
  deleteEPA,
};
