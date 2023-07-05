const { Department } = require("../models");
const { getResponse } = require("../utils/valueHelpers");

async function addDepartment(req, res) {
  try {
    const { name, description } = req.body;

    if (name.trim() === "") {
      const resp = getResponse(
        null,
        401,
        "Please provide the name of the role."
      );
      return res.send(resp);
    }

    const alreadyPresent = await Department.findOne({ where: { name } });

    if (alreadyPresent) {
      await Department.update({ is_deleted: false }, { where: { name } });

      const updatedRecord = Department.findOne({ where: { name } });

      const resp = getResponse(updatedRecord, 200, "Record added successfully");
      return res.send(resp);
    }

    await Department.create({
      name,
      description,
    });

    const addedDepartment = await Department.findOne({ where: { name } });

    const resp = getResponse(addedDepartment, 200, "Record added successfully");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    res.send(resp);
  }
}

async function editDepartment(req, res) {
  try {
    const values = req.body;
    const departmentID = parseInt(req.params.id);

    await Department.update(values, { where: { id: departmentID } });

    const updatedRecord = await Department.findByPk(departmentID);

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

async function getDepartments(req, res) {
  try {
    const departments = await Department.findAll({
      where: { is_deleted: false },
    });

    if (!departments.length) {
      const resp = getResponse(null, 404, "No records found");
      return res.send(resp);
    }

    const resp = getResponse(departments, 200, "Roles fetched successfully");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    console.error(err);
    res.send(resp);
  }
}

async function getDepartmentByID(req, res) {
  try {
    const departmentID = parseInt(req.params.id);

    const department = await Department.findByPk(departmentID, {
      where: { is_deleted: false },
    });

    if (!department) {
      const resp = getResponse(null, 404, "No records found");
      return res.send(resp);
    }

    const resp = getResponse(department, 200, "Roles fetched successfully");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    console.error(err);
    res.send(resp);
  }
}

module.exports = {
  addDepartment,
  editDepartment,
  getDepartments,
  getDepartmentByID,
};
