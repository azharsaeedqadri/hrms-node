const { EmployeeAllowance, EmployeeDeduction } = require("../models");
const {
  getResponse,
} = require("../utils/valueHelpers");
const { Op } = require("sequelize");

async function addPayrollItem(req, res) {
  try {
    const requestArray = Array.from(req.body);

    for (const item of requestArray) {
      for (const employeeId of item.employeeIds) {

        if (item.type === 0) {
          await EmployeeAllowance.create({
            allowance_id: item.id,
            employee_id: employeeId,
            amount: Math.round(item.amount),
          });
        }
        else if (item.type === 1) {
          await EmployeeDeduction.create({
            deduction_id: item.id,
            employee_id: employeeId,
            amount: Math.round(item.amount),
          });
        }
      };
    };

    const resp = getResponse(
      requestArray,
      200,
      "Added payroll records for selected employees"
    );

    res.send(resp);

  } catch (err) {
    const resp = getResponse(null, 400, "Something went wrong");
    console.error(err);
    res.send(resp);
  }
}

async function getAllPayrollRecords(req, res) {
  try {

    const request = req.body;

    var allowanceDate = new Date(request.date)

    const allEPAs = await EmployeeAllowance.findAll({
      where: {
        createdAt: { [Op.gte]: allowanceDate }
      }
    });

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

async function removePayrollItem(req, res) {
  try {
    const request = req.body;

    var reqDate = new Date(request.date)

    if (request.type === 0) {
      await EmployeeAllowance.destroy({
        where: {
          allowance_id: {
            [Op.eq]: request.id
          },
          createdAt: { [Op.gte]: reqDate }
        }
      });
    }
    else if (request.type === 1) {
      await EmployeeDeduction.destroy({
        where: {
          deduction_id: {
            [Op.eq]: request.id
          },
          createdAt: { [Op.gte]: reqDate }
        }
      });
    }

    const resp = getResponse(
      request,
      200,
      "Removed the selected allowance"
    );

    res.send(resp);

  } catch (err) {
    const resp = getResponse(null, 400, "Something went wrong");
    console.error(err);
    res.send(resp);
  }
}

async function removeSingleEmployeePayroll(req, res) {
  try {
    const request = req.body;

    var reqDate = new Date(request.date);

    if (request.type === 0) {
      await EmployeeAllowance.destroy({
        where: {
          allowance_id: {
            [Op.eq]: request.id
          },
          employee_id: {
            [Op.eq]: request.employeeId
          },
          createdAt: { [Op.gte]: reqDate }
        }
      });
    }
    else if (request.type === 1) {
      await EmployeeDeduction.destroy({
        where: {
          deduction_id: {
            [Op.eq]: request.id
          },
          employee_id: {
            [Op.eq]: request.employeeId
          },
          createdAt: { [Op.gte]: reqDate }
        }
      });
    }

    const resp = getResponse(
      request,
      200,
      "Removed the selected records"
    );

    res.send(resp);

  } catch (err) {
    const resp = getResponse(null, 400, "Something went wrong");
    console.error(err);
    res.send(resp);
  }
}

module.exports = {
  addPayrollItem,
  getAllPayrollRecords,
  removePayrollItem,
  removeSingleEmployeePayroll
};
