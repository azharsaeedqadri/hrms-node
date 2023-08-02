const { EmployeeAllowance, EmployeeDeduction } = require("../models");
const {
  getResponse, calculateOvertime, calculateLeaveEncashments, calculateEPF,
} = require("../utils/valueHelpers");
const { Sequelize, QueryTypes, Op } = require("sequelize");
const {
  GET_ALL_PAYROLLADJUSTMENT_ALLOWANCES,
  GET_ALL_PAYROLLADJUSTMENT_DEDUCTIONS
} = require("../utils/constants");
const db = require("../models");

async function addPayrollItem(req, res) {
  try {

    if (!req.body || !req.body.selectedAdjustments || !(req.body.hasOwnProperty("type")) || !req.body.employeeIds) {
      throw new Error('Request body is missing required parameters.');
    }

    const requestObj = req.body;

    var todaysDate = new Date();

    var startDate = new Date(todaysDate.getFullYear(), todaysDate.getMonth(), 1);
    var endDate = new Date(todaysDate.getFullYear(), todaysDate.getMonth() + 1, 0);

    for (const adjustment of requestObj.selectedAdjustments) {
      for (const employeeId of requestObj.employeeIds) {

        if (requestObj.type === 0) {

          await EmployeeAllowance.create({
            allowance_id: adjustment.id,
            employee_id: employeeId,
            amount: Math.round(adjustment.amount),
          });

          //const t = await sequelize.transaction();

          // const result = await models.sequelize.transaction(async (trans) => {
          //   try {
          //     //await sequelize.sync(); // Create the table if it doesn't exist

          //     const [empAllowance, created] = await EmployeeAllowance.findOrCreate({
          //       where: {
          //         allowance_id: adjustment.id,
          //         employee_id: employeeId,
          //         createdAt: {
          //           [Op.between]: [startDate, endDate],
          //         }
          //       },
          //       defaults: {
          //         amount: Math.round(adjustment.amount),
          //       },
          //       transaction: trans
          //     });

          //     if (created) {
          //       console.log('Payroll item created:', empAllowance);
          //     } else {
          //       console.log('Payroll item found:', empAllowance);
          //     }
          //   } catch (error) {
          //     console.error('Error:', error);
          //   }
          // })();
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
    var message = err.message ? err.message : "Something went wrong while deleting the records";
    const resp = getResponse(null, 400, message);
    console.error(err);
    res.send(resp);
  }
}

async function getAllPayrollRecords(req, res) {
  try {

    if (!req.body || !req.body.date) {
      throw new Error('Request body is missing required parameters.');
    }

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
    var message = err.message ? err.message : "Something went wrong while deleting the records";
    const resp = getResponse(null, 400, message);
    console.error(err);
    res.send(resp);
  }
}

async function removePayrollItem(req, res) {
  try {

    if (!req.body || !req.body.id || !(req.body.hasOwnProperty("type")) || !req.body.date) {
      throw new Error('Request body is missing required parameters.');
    }

    const request = req.body;

    var reqDate = new Date(request.date)

    var startDate = new Date(reqDate.getFullYear(), reqDate.getMonth(), 1);
    var endDate = new Date(reqDate.getFullYear(), reqDate.getMonth() + 1, 0);

    var resp = null;
    if (request.type === 0) {
      // await EmployeeAllowance.destroy({
      //   where: {
      //     allowance_id: {
      //       [Op.eq]: request.id
      //     },
      //     createdAt: {
      //       [Op.between]: [startDate, endDate],
      //     }
      //   }
      // });

      const filterOptions = {
        allowance_id: {
          [Op.eq]: request.id
        },
        createdAt: {
          [Op.between]: [startDate, endDate],
        }
      };

      if (request.employeeId) {
        filterOptions.employee_id = {
          [Op.eq]: request.employeeId,
        };
      }

      var records = await EmployeeAllowance.findAll({
        where: filterOptions
      });

      if (records.length > 0) {
        await EmployeeAllowance.destroy({
          where: filterOptions
        });

        resp = getResponse(request, 200, "Records deleted successfully!");
      } else {
        resp = getResponse(request, 404, "Records not found.");
      }

    }
    else if (request.type === 1) {
      // await EmployeeDeduction.destroy({
      //   where: {
      //     deduction_id: {
      //       [Op.eq]: request.id
      //     },
      //     createdAt: {
      //       [Op.between]: [startDate, endDate],
      //     }
      //   }
      // });

      const filterOptions = {
        deduction_id: {
          [Op.eq]: request.id
        },
        createdAt: {
          [Op.between]: [startDate, endDate],
        }
      };

      if (request.employeeId) {
        filterOptions.employee_id = {
          [Op.eq]: request.employeeId,
        };
      }

      var records = await EmployeeDeduction.findAll({
        where: filterOptions
      });

      if (records.length > 0) {
        await EmployeeDeduction.destroy({
          where: filterOptions
        });
        resp = getResponse(request, 200, "Records deleted successfully!");
      } else {
        resp = getResponse(request, 404, "Records not found.");
      }
    }

    // const resp = getResponse(
    //   request,
    //   200,
    //   "Removed the selected adjustments"
    // );

    res.send(resp);

  } catch (err) {
    var message = err.message ? err.message : "Something went wrong while deleting the records";
    const resp = getResponse(null, 400, message);
    console.error(err);
    res.send(resp);
  }
}

async function addOvertime(req, res) {
  try {

    if (!req.body ||
      !(req.body.hasOwnProperty("id")) ||
      !(req.body.hasOwnProperty("hours")) ||
      !req.body.employees) {
      throw new Error('Request body is missing required parameters.');
    }

    const { id, hours, employees } = req.body;

    for (const employee of employees) {
      const { employeeId, grossSalary } = employee;

      console.log(
        `========== adding overtime for employeeId: ${employeeId} ==========`
      );

      const overtimeAmout = calculateOvertime(hours, grossSalary);

      await EmployeeAllowance.create({
        allowance_id: id,
        employee_id: employeeId,
        amount: Math.round(overtimeAmout),
      });

      console.log(
        `========== added overtime for employeeId: ${employeeId} ==========`
      );
    }

    const resp = getResponse(
      employees,
      200,
      "Added overtime for these employees"
    );

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, "Something went wrong");
    console.error(err);
    res.send(resp);
  }
}

async function addEncashedLeaves(req, res) {
  try {

    if (!req.body ||
      !(req.body.hasOwnProperty("id")) ||
      !(req.body.hasOwnProperty("leaveBalance")) ||
      !req.body.employees) {
      throw new Error('Request body is missing required parameters.');
    }

    const { id, leaveBalance, employees } = req.body;

    for (const employee of employees) {
      const { employeeId, hourlyRate } = employee;

      console.log(
        `========== adding encashed leaves for employeeId: ${employeeId} ==========`
      );

      const leaveEncashmentAmount = calculateLeaveEncashments(
        leaveBalance,
        hourlyRate
      );
      await EmployeeAllowance.create({
        allowance_id: id,
        employee_id: employeeId,
        amount: Math.round(leaveEncashmentAmount),
      });

      console.log(
        `========== added encashed leaves for employeeId: ${employeeId} ==========`
      );
    }

    const resp = getResponse(
      employees,
      200,
      "Added encashed leaves for these employees"
    );

    res.send(resp);
    // const promises = employees.map(async (employee) => {
    //   const { employee_id, gross_salary } = employee;

    //   const result = await EmployeeInformation.findByPk(employee_id);
    //   return result;
    // });

    // const employeesInformation = await Promise.all(promises);

    // return res.send(results);

    //   for (const employee of employees) {
    //     const {employee_id} = employee

    //     const employee = await
    //   }
  } catch (err) {
    const resp = getResponse(null, 400, "Something went wrong");
    console.error(err);
    res.send(resp);
  }
}

async function addEPF(req, res) {
  try {

    if (!req.body ||
      !(req.body.hasOwnProperty("id")) ||
      !req.body.employees) {
      throw new Error('Request body is missing required parameters.');
    }

    const { id, employees } = req.body;

    for (const employee of employees) {
      const { employeeId, basicSalary } = employee;

      console.log(
        `========== adding epf for employeeId: ${employeeId} ==========`
      );

      const epfAmount = calculateEPF(basicSalary);

      await EmployeeDeduction.create({
        deduction_id: id,
        employee_id: employeeId,
        amount: Math.round(epfAmount),
      });

      console.log(
        `========== added epf for basicSalary: ${basicSalary} ==========`
      );
    }

    const resp = getResponse(employees, 200, "Added epf for these employees");

    res.send(resp);
    // const promises = employees.map(async (employee) => {
    //   const { employee_id, gross_salary } = employee;

    //   const result = await EmployeeInformation.findByPk(employee_id);
    //   return result;
    // });

    // const employeesInformation = await Promise.all(promises);

    // return res.send(results);

    //   for (const employee of employees) {
    //     const {employee_id} = employee

    //     const employee = await
    //   }
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
  addOvertime,
  addEncashedLeaves,
  addEPF
};
