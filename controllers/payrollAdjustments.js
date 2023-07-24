const { EmployeeAllowance, EmployeeDeduction } = require("../models");
const {
  getResponse,
} = require("../utils/valueHelpers");
const { QueryTypes, Op } = require("sequelize");
const {
  GET_ALL_PAYROLLADJUSTMENT_ALLOWANCES,
  GET_ALL_PAYROLLADJUSTMENT_DEDUCTIONS
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

    var startDate = new Date(allowanceDate.getFullYear(), allowanceDate.getMonth(), 1);
    var endDate = new Date(allowanceDate.getFullYear(), allowanceDate.getMonth() + 1, 0);

    const payrollAdjustmentsAllowances = await db.sequelize.query(GET_ALL_PAYROLLADJUSTMENT_ALLOWANCES,
      {
        replacements: { startDate: startDate, endDate: endDate },
        type: QueryTypes.SELECT,
      });


    const payrollAdjustmentsDeductions = await db.sequelize.query(GET_ALL_PAYROLLADJUSTMENT_DEDUCTIONS,
      {
        replacements: { startDate: startDate, endDate: endDate },
        type: QueryTypes.SELECT,
      });

    const allowancesGroupedData = payrollAdjustmentsAllowances.reduce((acc, obj) => {
      const key = `${obj.allowance_id}-${obj.name}`;
      const { allowance_id, ...rest } = obj;
      acc[key] = acc[key] ? [...acc[key], rest] : [rest];
      return acc;
    }, {});

    const deductionsGroupedData = payrollAdjustmentsDeductions.reduce((acc, obj) => {
      const key = `${obj.deduction_id}-${obj.name}`;
      const { deduction_id, ...rest } = obj;
      acc[key] = acc[key] ? [...acc[key], rest] : [rest];
      return acc;
    }, {});

    const allowancesArray = Object.entries(allowancesGroupedData).map(([id, values]) => (
      {
        id: parseInt(id, 10),
        name: values[0].name,
        amount: values[0].amount,
        type: 0,
        employees: values.map((val) => ({ id: val.employee_id, name: `${val.first_name} ${val.last_name}` }))//.join(', '),
      }));

    const deductionsArray = Object.entries(deductionsGroupedData).map(([id, values]) => (
      {
        id: parseInt(id, 10),
        name: values[0].name,
        amount: values[0].amount,
        type: 1,
        employees: values.map((val) => ({ id: val.employee_id, name: `${val.first_name} ${val.last_name}` }))//.join(', '),
      }));

    allowancesArray.push(...deductionsArray);

    if (!allowancesArray.length) {
      const resp = getResponse(null, 404, "Not Found");
      return res.send(resp);
    }

    const resp = getResponse(allowancesArray, 200, "Success");

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
