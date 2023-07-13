const { EmployeeAllowance, EmployeeDeduction } = require("../models");
const {
  calculateOvertime,
  getResponse,
  calculateLeaveEncashments,
  calculateEPF,
} = require("../utils/valueHelpers");

const OVERTIME_ALLOWANCE_ID = 114;
const LEAVE_ENCASHMENT_ALLOWANCE_ID = 115;
const EPF_DEDUCTION_ID = 15;

async function getOvertime(req, res) {
  try {
    const { employees, no_of_hours } = req.body;

    for (const employee of employees) {
      const { employee_id, gross_salary } = employee;

      console.log(
        `========== adding overtime for employee_id: ${employee_id} ==========`
      );

      const overtimeAmout = calculateOvertime(no_of_hours, gross_salary);
      await EmployeeAllowance.create({
        allowance_id: OVERTIME_ALLOWANCE_ID,
        employee_id,
        amount: Math.round(overtimeAmout),
      });

      console.log(
        `========== added overtime for employee_id: ${employee_id} ==========`
      );
    }

    const resp = getResponse(
      employees,
      200,
      "Added overtime for these employees"
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

async function getEncashedLeaves(req, res) {
  try {
    const { employees, leaveBalance } = req.body;

    for (const employee of employees) {
      const { employee_id, hourly_rate } = employee;

      console.log(
        `========== adding encashed leaves for employee_id: ${employee_id} ==========`
      );

      const leaveEncashmentAmount = calculateLeaveEncashments(
        leaveBalance,
        hourly_rate
      );
      await EmployeeAllowance.create({
        allowance_id: LEAVE_ENCASHMENT_ALLOWANCE_ID,
        employee_id,
        amount: Math.round(leaveEncashmentAmount),
      });

      console.log(
        `========== added encashed leaves for employee_id: ${employee_id} ==========`
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

async function getEPF(req, res) {
  try {
    const { employees } = req.body;

    for (const employee of employees) {
      const { employee_id, basic_salary } = employee;

      console.log(
        `========== adding epf for employee_id: ${employee_id} ==========`
      );

      const epfAmount = calculateEPF(basic_salary);

      await EmployeeDeduction.create({
        deduction_id: EPF_DEDUCTION_ID,
        employee_id,
        amount: Math.round(epfAmount),
      });

      console.log(
        `========== added epf for employee_id: ${employee_id} ==========`
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
  getOvertime,
  getEncashedLeaves,
  getEPF,
};
