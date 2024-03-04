const { Designation } = require("../models");
const { getResponse } = require("../utils/valueHelpers");

async function addDesignation(req, res) {
  try {
    const { name, description } = req.body;

    if (name.trim() === "") {
      const resp = getResponse(
        null,
        401,
        "Please provide the name of the Designation."
      );
      return res.send(resp);
    }

    const alreadyPresent = await Designation.findOne({ where: { name } });

    if (alreadyPresent) {
      await Designation.update({ is_deleted: false }, { where: { name } });

      const updatedRecord = Designation.findOne({ where: { name } });

      const resp = getResponse(updatedRecord, 200, "Record added successfully");
      return res.send(resp);
    }

    await Designation.create({
      name,
      description,
    });

    const addedDesignation = await Department.findOne({ where: { name } });

    const resp = getResponse(addedDesignation, 200, "Record added successfully");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    res.send(resp);
  }
}

async function editDesignation(req, res) {
  try {
    const values = req.body;
    const designationID = parseInt(req.params.id);

    await Designation.update(values, { where: { id: designationID } });

    const updatedRecord = await Designation.findByPk(designationID);

    const resp = getResponse(
      updatedRecord,
      200,
      "Record updated successfully."
    );

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    res.send(resp);
    console.error(err);
  }
}

async function getDesignations(req, res) {
  try {
    const designations = await Designation.findAll({
      where: { is_deleted: false },
    });

    if (!designations.length) {
      const resp = getResponse(null, 404, "No records found");
      return res.send(resp);
    }

    const resp = getResponse(designations, 200, "Designations fetched successfully");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    console.error(err);
    res.send(resp);
  }
}

async function getDesignationByID(req, res) {
  try {
    const designationID = parseInt(req.params.id);

    const designation = await Designation.findByPk(designationID, {
      where: { is_deleted: false },
    });

    if (!designation) {
      const resp = getResponse(null, 404, "No records found");
      return res.send(resp);
    }

    const resp = getResponse(designation, 200, "Designations fetched successfully");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    console.error(err);
    res.send(resp);
  }
}

module.exports = {
  addDesignation,
  editDesignation,
  getDesignations,
  getDesignationByID,
};
