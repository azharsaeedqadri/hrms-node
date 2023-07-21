const { EmployeeAllowance, EmployeeDeduction } = require("../models");
const {
  getResponse,
} = require("../utils/valueHelpers");
const { QueryTypes, Op } = require("sequelize");
const {
  GET_ALL_PAYROLLADJUSTMENT_ALLOWANCES,
} = require("../utils/constants");
const db = require("../models");

async function addPayrollItem(req, res) {
  try {
    const requestObj = req.body;

    for (const adjustment of requestObj.selectedAdjustments) {
      for (const employeeId of requestObj.employeeIds) {

        if (requestObj.type === 0) {
          await EmployeeAllowance.create({
            allowance_id: adjustment.id,
            employee_id: employeeId,
            amount: Math.round(adjustment.amount),
          });
        }
        else if (requestObj.type === 1) {
          await EmployeeDeduction.create({
            deduction_id: adjustment.id,
            employee_id: employeeId,
            amount: Math.round(adjustment.amount),
          });
        }
      };
    };

    const resp = getResponse(
      requestObj,
      200,
      "Added payroll adjustments for selected employees"
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

    // const allEPAs = await EmployeeAllowance.findAll({
    //   where: {
    //     createdAt: { [Op.gte]: allowanceDate }
    //   }
    // });

    const payrollAdjustmentsList = await db.sequelize.query(
      GET_ALL_PAYROLLADJUSTMENT_ALLOWANCES,
      {
        type: QueryTypes.SELECT,
        replacements: {
          createdAt: allowanceDate,
        },
      }
    );

    if (!payrollAdjustmentsList.length) {
      const resp = getResponse(null, 404, "Not Found");
      return res.send(resp);
    }

    const resp = getResponse(payrollAdjustmentsList, 200, "Success");

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
      "Removed the selected adjustments"
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
      "Removed the selected adjustments"
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
