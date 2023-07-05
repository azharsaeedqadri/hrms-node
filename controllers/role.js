const { RoleTypeEmployee } = require("../models");
const { getResponse } = require("../utils/valueHelpers");

async function addRoleType(req, res) {
     try {
          const { name, role_level, description, department_id } = req.body;

          if (name.trim() === "") {
               const resp = getResponse(null, 401, "Please provide the name of the role.");
               return res.send(resp);
          }

          const alreadyPresent = await RoleTypeEmployee.findOne({ where: { name } });

          if (alreadyPresent) {
               const resp = getResponse(null, 200, "Record already present");
               return res.send(resp);
          }

          await RoleTypeEmployee.create({
               name,
               role_level,
               description,
               department_id,
          });

          const addedRole = await RoleTypeEmployee.findOne({ where: { name } });

          const resp = getResponse(addedRole, 200, "Record added successfully");

          res.send(resp);
     } catch (err) {
          const resp = getResponse(null, 400, err);
          res.send(resp);
     }
}

async function editRole(req, res) {
     try {
          const values = req.body;
          const roleID = parseInt(req.params.id);
          await RoleTypeEmployee.update(values, { where: { id: roleID } });

          const updatedRecord = await RoleTypeEmployee.findByPk(roleID);

          const resp = getResponse(updatedRecord, 200, "Record updated successfully.");
          res.send(resp);
     } catch (err) {
          const resp = getResponse(null, 400, err);
          res.send(resp);
     }
}

async function getRoleTypes(req, res) {
     try {
          const roleTypes = await RoleTypeEmployee.findAll({
               where: { is_deleted: false },
               order: [["role_level", "ASC"]],
          });

          if (!roleTypes.length) {
               const resp = getResponse(null, 404, "No records found");
               return res.send(resp);
          }

          const resp = getResponse(roleTypes, 200, "Roles fetched successfully");

          res.send(resp);
     } catch (err) {
          const resp = getResponse(null, 400, err);
          res.send(resp);
     }
}

async function getRoleTypeByID(req, res) {
     try {
          const roleID = parseInt(req.params.id);

          const role = await RoleTypeEmployee.findByPk(roleID);

          if (!role) {
               const resp = getResponse(null, 404, "No records found");
               return res.send(resp);
          }

          const resp = getResponse(role, 200, "Roles fetched successfully");

          res.send(resp);
     } catch (err) {
          const resp = getResponse(null, 400, err);
          res.send(resp);
     }
}

async function deleteRole(req, res) {
     try {
          const roleID = parseInt(req.params.id);

          const role = await RoleTypeEmployee.findByPk(roleID);

          if (!role) {
               const resp = getResponse(null, 404, "No role Found with this Id.");
               return res.status(200).send(resp);
          }

          const deletedRecord = await RoleTypeEmployee.destroy({
               where: { id: roleID },
          });

          if (deletedRecord) {
               const resp = getResponse({ id: roleID }, 200, "Success");
               return res.send(resp);
          } else {
               const resp = getResponse(null, 400, "Error while deleting record");
               return res.send(resp);
          }
     } catch (err) {
          const resp = getResponse(null, 400, "Something went wrong");
          return res.send(resp);
     }
}

module.exports = {
     addRoleType,
     getRoleTypes,
     editRole,
     getRoleTypeByID,
     deleteRole,
};
