const { Deduction, AllowanceAndDeductionType } = require("../models");
const {
  getResponse,
  getUserIDByBearerToken,
} = require("../utils/valueHelpers");

async function addNewDeduction(req, res) {
  try {
    const {
      name,
      description,
      deduction_type,
      is_fixed,
      status,
      company_id,
      amount,
      percentage,
    } = req.body;

    const isAlreadyPresent = await Deduction.findOne({
      where: { name },
    });

    if (isAlreadyPresent) {
      const resp = getResponse({}, 400, "Deduction already exist");
      return res.send(resp);
    }

    await Deduction.create({
      name,
      description,
      deduction_type,
      amount,
      percentage,
      is_fixed,
      status,
      company_id,
    });

    const addedDeduction = await Deduction.findOne({
      include: AllowanceAndDeductionType,
      where: {
        name,
      },
    });

    const resp = getResponse(
      addedDeduction,
      201,
      "Deduction Added Successfully."
    );

    res.status(201).send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, "Something went wrong");
    res.send(resp);
  }
}

async function getAllDeductions(req, res) {
  try {
    const deductionsList = await Deduction.findAll({
      include: AllowanceAndDeductionType,
    });

    if (!deductionsList.length) {
      const resp = getResponse([], 404, "No Deductions Found");
      return res.status(200).send(resp);
    }

    const resp = getResponse(deductionsList, 200, "Success");

    res.status(200).send(resp);
  } catch (err) {
    const resp = getResponse(err.message, 400, "Something went wrong");
    res.send(resp);
  }
}

async function getDeductionByID(req, res) {
  try {
    const deductionID = parseInt(req.params.id);

    const deduction = await Deduction.findByPk(deductionID, {
      attributes: [
        "deduction_id",
        "name",
        "percentage",
        "amount",
        "description",
        "status",
      ],
    });

    if (!deduction) {
      const resp = getResponse(null, 404, "No Deduction Found with this Id.");
      return res.status(200).send(resp);
    }

    const resp = getResponse(deduction, 200, "Success");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, "Something went wrong");
    res.send(resp);
  }
}

async function editDeduction(req, res) {
  try {
    const deductionID = parseInt(req.params.id);
    const bodyValues = req.body;
    const token = req.header("authorization").split("Bearer ");

    const updatedBy = getUserIDByBearerToken(token[1]);

    const values = { ...bodyValues, updatedBy };

    if (Object.keys(values).length === 0 && values.constructor === Object) {
      const resp = getResponse({}, 401, "No values to update");
      return res.send(resp);
    }

    const deduction = await Deduction.findByPk(deductionID);

    if (!deduction) {
      const resp = getResponse(null, 404, "No Deduction Found with this Id.");
      return res.status(200).send(resp);
    }

    await Deduction.update(values, {
      where: {
        deduction_id: deductionID,
      },
    });

    const updatedDeduction = await Deduction.findByPk(deductionID, {
      attributes: [
        "deduction_id",
        "name",
        "percentage",
        "amount",
        "description",
        "status",
      ],
    });

    const resp = getResponse(
      updatedDeduction,
      200,
      "deduction updated successfully"
    );

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, "Something went wrong");
    res.send(resp);
  }
}

async function deleteDeduction(req, res) {
  try {
    const deductionID = parseInt(req.params.id);

    const deduction = await Deduction.findByPk(deductionID);

    if (!deduction) {
      const resp = getResponse(null, 404, "No Deduction Found with this Id.");
      return res.status(200).send(resp);
    }

    const deletedRecord = await Deduction.destroy({
      where: { deduction_id: deductionID },
    });

    const resp = getResponse(deletedRecord, 200, "Success");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, "Something went wrong");
    res.send(resp);
  }
}

module.exports = {
  addNewDeduction,
  getAllDeductions,
  getDeductionByID,
  editDeduction,
  deleteDeduction,
};
