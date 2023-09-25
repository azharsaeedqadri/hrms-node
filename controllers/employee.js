const {
  EmployeeInformation,
  EmployeeLeavesRecord,
  EmployeeInformationAudit,
  HrUser,
  EmployeeAllowance,
  Allowance,
  MedicalLimit,
  EmployeeMonthlyPayroll,
  TaxSlab,
  MedicalReimbursement,
  StatusType,
} = require("../models");
const db = require("../models");
const { QueryTypes, Op } = require("sequelize");
const Sequelize = require("sequelize");
const {
  GET_ALL_EMPLOYEES_QUERY,
  GET_EMPLOYEE_BY_ID,
  FINALIZED_LEAVE_RECORDS_BY_EMPLOYEE_ID_QUERY,
  GET_CREATED_EMPLOYEE_ALLOWANCES,
  EMPLOYEE_ACTIVITY_LOGS_QUERY,
  EMPLOYEE_ACTIVITY_LOGS_MOBILE_QUERY,
} = require("../utils/constants");
const {
  getResponse,
  getUserIDByBearerToken,
  calculateAnnualTax,
} = require("../utils/valueHelpers");

async function addNewEmployee(req, res) {
  try {
    const {
      salutation_id,
      employee_code,
      employee_type_id,
      first_name,
      middle_name,
      last_name,
      cnic_number,
      date_of_birth,
      gender_id,
      marital_status_id,
      mobile_number,
      phone_number,
      present_address,
      present_city,
      permanent_address,
      permanent_city,
      emergency_contact,
      personal_email,
      office_email,
      joining_date,
      designation_id,
      department_id,
      role_id,
      team_id,
      salary_type_id,
      current_salary,
      gross_salary,
      company_id,
      basic_salary,
      leave_balance,
      ipd_balance,
      opd_balance,
      currency_type,
      project_manager,
      resignation_date,
      rejoining_date,
      blood_group,
      is_probation_completed,
      bank_id,
      acc_title,
      acc_number,
      photo,
      prev_experience,
      education_type_id,
      institute,
      edu_attachment,
      resume,
      createdBy,
      updatedBy,
      allowances,
    } = req.body;

    const isAlreadyPresent = await EmployeeInformation.findOne({
      where: { cnic_number },
    });

    if (isAlreadyPresent) {
      const resp = getResponse({}, 400, "Employee already exist");
      return res.send(resp);
    }

    if (office_email === isAlreadyPresent?.office_email) {
      const resp = getResponse(
        null,
        400,
        "Employee with this Email already exists"
      );
      return res.send(resp);
    }

    const medicalLimits = await MedicalLimit.findAll();

    const { ipd_limit, opd_limit } = medicalLimits[0];

    const annualSalary = gross_salary * 12;
    const weeklySalary = annualSalary / 52;
    const dailySalary = weeklySalary / 5;
    const hourlyRate = dailySalary / 8;

    await EmployeeInformation.create({
      salutation_id,
      employee_code,
      employee_type_id,
      first_name,
      middle_name,
      last_name,
      cnic_number,
      date_of_birth,
      gender_id,
      marital_status_id,
      mobile_number,
      phone_number,
      present_address,
      present_city,
      permanent_address,
      permanent_city,
      emergency_contact,
      personal_email,
      office_email,
      joining_date,
      designation_id,
      department_id,
      role_id,
      team_id,
      salary_type_id,
      current_salary,
      gross_salary,
      hourly_rate: hourlyRate || null,
      company_id,
      basic_salary,
      leave_balance,
      ipd_balance: ipd_balance || ipd_limit,
      opd_balance: opd_balance || opd_limit,
      currency_type,
      project_manager,
      resignation_date,
      rejoining_date,
      blood_group,
      is_probation_completed,
      bank_id,
      acc_title,
      acc_number,
      photo,
      prev_experience,
      education_type_id,
      institute,
      edu_attachment,
      resume,
      createdBy,
      updatedBy,
      is_deleted: false,
      is_active: true,
    });

    const addedUser = await EmployeeInformation.findOne({
      where: {
        cnic_number,
      },
      include: EmployeeAllowance,
    });

    if (!allowances.length) {
      const resp = getResponse(addedUser, 201, "Employee added successfully");
      return res.send(resp);
    }

    const employeeAllowances = [];

    for (const allowance of allowances) {
      employeeAllowances.push({
        employee_id: parseInt(addedUser.employee_id),
        allowance_id: allowance.allowance_id,
        percentage: allowance.percentage,
      });
    }

    await EmployeeAllowance.bulkCreate(employeeAllowances);

    const createdEmployeeAllowances = await db.sequelize.query(
      GET_CREATED_EMPLOYEE_ALLOWANCES,
      {
        type: QueryTypes.SELECT,
        replacements: {
          employee_id: addedUser.employee_id,
        },
      }
    );

    const responseData = {
      addedUser,
      allowances: createdEmployeeAllowances,
    };

    const resp = getResponse(responseData, 201, "Employee Added Successfully.");

    res.status(201).send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    console.error(err);
    res.send(resp);
  }
}

async function getAllEmployees(req, res) {
  try {
    const employeesList = await db.sequelize.query(GET_ALL_EMPLOYEES_QUERY, {
      type: QueryTypes.SELECT,
    });

    if (!employeesList.length) {
      const resp = getResponse(null, 404, "No Employees Found");
      return res.status(404).send(resp);
    }

    var updatedEmployeesList = await Promise.all(
      employeesList.map(async (emp) => {
        const createdEmployeeAllowances = await db.sequelize.query(
          GET_CREATED_EMPLOYEE_ALLOWANCES,
          {
            type: QueryTypes.SELECT,
            replacements: {
              employee_id: emp.employee_id,
            },
          }
        );

        return { ...emp, allowances: createdEmployeeAllowances };
      })
    );

    const resp = getResponse(updatedEmployeesList, 200, "Success");

    res.status(200).send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    res.send(resp);
  }
}

async function getEmployeeByID(req, res) {
  try {
    const employeeID = parseInt(req.params.id);

    const employee = await db.sequelize.query(GET_EMPLOYEE_BY_ID, {
      type: QueryTypes.SELECT,
      replacements: {
        employeeID,
      },
    });

    if (!employee) {
      const resp = getResponse(null, 404, "No Employee Found");
      return res.status(404).send(resp);
    }

    const employeeFinalizedLeaveRequests = await db.sequelize.query(
      FINALIZED_LEAVE_RECORDS_BY_EMPLOYEE_ID_QUERY,
      {
        type: QueryTypes.SELECT,
        replacements: {
          employeeID,
        },
      }
    );

    const employeeStatusLogs = await EmployeeInformationAudit.findAll({
      where: {
        employee_id: employeeID,
        action_performed: `Employee "Status" Updated`,
      },
    });

    const employeeActivityLogs = await db.sequelize.query(
      EMPLOYEE_ACTIVITY_LOGS_QUERY,
      {
        type: QueryTypes.SELECT,
        replacements: { employeeID },
      }
    );

    const reimbursements = await MedicalReimbursement.findAll({
      where: {
        // statu 2 is for approved and 4 is for rejected
        status: { [Op.or]: [2, 4] },
      },
      include: [{ model: StatusType }, { model: EmployeeInformation }],
    });

    const statusLogsData = await Promise.all(
      employeeStatusLogs.map(async (emp) => {
        const user = await HrUser.findByPk(emp.updated_by);

        const transformedData = {
          updated_date: emp.updated_date,
          updated_by: `${user.first_name} ${user.last_name}`,
          role: user.role === 2 ? "HR Manager" : "Project Manager",
          active_status: emp.is_active,
          resignation_date: emp.resignation_date,
          resignation_reason: emp.resignation_reason,
          rejoining_date: emp.rejoining_date,
          rejoining_reason: emp.rejoining_reason,
        };

        return transformedData;
      })
    );

    const createdEmployeeAllowances = await db.sequelize.query(
      GET_CREATED_EMPLOYEE_ALLOWANCES,
      {
        type: QueryTypes.SELECT,
        replacements: {
          employee_id: employeeID,
        },
      }
    );

    // Payroll History

    let updatedPayrollHistory = [];
    const filterOptions = {
      employee_id: { [Op.eq]: employeeID },
    };

    const employeePayrollHistory = await EmployeeMonthlyPayroll.findAll({
      where: filterOptions,
    });

    const taxSlabs = await TaxSlab.findAll();

    var grossSalaryAllowances = await EmployeeAllowance.findAll({
      where: {
        employee_id: { [Op.eq]: employee[0].employee_id },
      },
      include: [
        {
          model: Allowance,
          where: { is_part_of_gross_salary: { [Op.eq]: true } },
        },
      ],
    });

    var nonTaxableGsAllowances = grossSalaryAllowances.reduce(
      (accumulator, current) => {
        if (!accumulator["sum"]) {
          accumulator["sum"] = { value: 0 };
        }

        if (current.Allowance.is_taxable === false)
          accumulator["sum"].value +=
            (current.percentage * employee[0].gross_salary) / 100 || 0;
        return accumulator;
      },
      {}
    );

    var nonTaxableAmount = nonTaxableGsAllowances?.sum?.value || 0;
    var annualGrossSalary = (employee[0].gross_salary - nonTaxableAmount) * 12;

    var taxSlab = taxSlabs.filter((obj) => {
      var result =
        annualGrossSalary >= obj.dataValues.minimum_income &&
        annualGrossSalary <= obj.dataValues.maximum_income;
      return result;
    })[0];

    var annualTaxableSalary = calculateAnnualTax(taxSlab, annualGrossSalary);
    var monthlyTaxableSalary = annualTaxableSalary / 12;

    const date = new Date(`July 1, ${new Date().getFullYear()}`);
    const endDate = new Date(`June 30, ${new Date().getFullYear() + 1}`);
    var remainingMonths = 0;
    while (date <= endDate) {
      if (date.getMonth() === new Date().getMonth()) {
        remainingMonths =
          endDate.getMonth() -
          date.getMonth() +
          12 * (endDate.getFullYear() - date.getFullYear());
        break;
      }
      date.setMonth(date.getMonth() + 1);
    }

    const respData = {
      ...employee[0],
      allowances: createdEmployeeAllowances,
      finalizedLeaves: employeeFinalizedLeaveRequests || {},
      medicalReimbursements: reimbursements || [],
      statusLogs: statusLogsData || {},
      activityLogs: employeeActivityLogs,
      payrollHistory: employeePayrollHistory || [],
      tax: {
        annualTax: Math.round(annualTaxableSalary),
        monthlyTax: Math.round(monthlyTaxableSalary),
        remainingFiscalYearMonths: remainingMonths
      },
    };

    const resp = getResponse(respData, 200, "Success");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, "Something went wrong");
    res.send(resp);
  }
}

async function editEmployeeInformation(req, res) {
  try {
    const employeeID = parseInt(req.params.id);
    const bodyValues = req.body;
    const { allowances, gross_salary } = bodyValues;
    const token = req.header("authorization").split("Bearer ");

    const updatedBy = getUserIDByBearerToken(token[1]);

    const annualSalary = gross_salary * 12;
    const weeklySalary = annualSalary / 52;
    const dailySalary = weeklySalary / 5;
    const hourlyRate = dailySalary / 8;

    const values = { ...bodyValues, updatedBy, hourly_rate: hourlyRate };

    if (Object.keys(values).length === 0 && values.constructor === Object) {
      const resp = getResponse({}, 401, "No values to update");
      return res.send(resp);
    }

    const isAlreadyPresent = await EmployeeInformation.findOne({
      where: {
        cnic_number: values.cnic_number,
        [Op.not]: { employee_id: employeeID },
      },
    });

    if (isAlreadyPresent) {
      const resp = getResponse({}, 400, "Employee already exist");
      return res.send(resp);
    }

    await EmployeeInformation.update(values, {
      where: {
        employee_id: employeeID,
      },
    });

    console.log("=====================================");
    console.log("Deleting existing employee allowances");
    console.log("=====================================");

    const allowanceIds = allowances.map((obj) => obj.allowance_id);

    await EmployeeAllowance.destroy({
      where: {
        employee_id: { [Op.eq]: employeeID },
        allowance_id: { [Op.or]: allowanceIds },
      },
    });

    console.log("=====================================");
    console.log("Deleted existing employee allowances");
    console.log("=====================================");

    const employeeAllowances = [];

    for (const allowance of allowances) {
      employeeAllowances.push({
        employee_id: employeeID,
        allowance_id: allowance.allowance_id,
        percentage: allowance.percentage,
      });
    }

    console.log("=====================================");
    console.log("Creating new employee allowances in edit endpoint");
    console.log("=====================================");

    await EmployeeAllowance.bulkCreate(employeeAllowances);

    console.log("=====================================");
    console.log("Created new employee allowances in edit endpoint");
    console.log("=====================================");

    const createdEmployeeAllowances = await db.sequelize.query(
      GET_CREATED_EMPLOYEE_ALLOWANCES,
      {
        type: QueryTypes.SELECT,
        replacements: {
          employee_id: employeeID,
        },
      }
    );

    const updatedEmployee = await db.sequelize.query(GET_EMPLOYEE_BY_ID, {
      type: QueryTypes.SELECT,
      replacements: {
        employeeID,
      },
    });

    const responseData = {
      updatedEmployee,
      allowances: createdEmployeeAllowances,
    };

    const resp = getResponse(responseData, 200, "user updated successfully");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, "Something went wrong");
    console.error(err);
    res.send(resp);
  }
}

async function updateEmployeeStatus(req, res) {
  try {
    const {
      employee_id,
      is_active,
      rejoining_date,
      resignation_date,
      rejoining_reason,
      resignation_reason,
    } = req.body;

    const token = req.header("authorization").split("Bearer ");

    const updatedBy = getUserIDByBearerToken(token[1]);

    // Check if employee exists
    const employee = await EmployeeInformation.findOne({
      where: { employee_id },
    });

    if (!employee) {
      const resp = getResponse({}, 400, "Employee not found");
      return res.status(200).send(resp);
    }

    // Set rejoining date only if we change status from Inactive -> Active
    let data = { is_active, resignation_reason, rejoining_reason, updatedBy };

    if (is_active === true) {
      data["rejoining_date"] = rejoining_date;
      data["rejoining_reason"] = rejoining_reason;
    }

    // Set resignation date only if we change status from Active -> Inactive
    if (is_active === false) {
      data["resignation_date"] = resignation_date;
      data["resignation_reason"] = resignation_reason;
    }

    // Update record
    const response = await EmployeeInformation.update(data, {
      where: {
        employee_id,
      },
    });

    if (!response) {
      const resp = getResponse({}, 400, "Error while updating record");
      return res.status(200).send(resp);
    }

    const resp = getResponse(
      { id: employee_id, is_active },
      200,
      "Record updated successfully"
    );

    return res.status(200).send(resp);
  } catch (err) {
    console.log(err);
    const resp = getResponse(null, 400, "Something went wrong");
    res.send(resp);
  }
}

async function employeeListForCalendar(req, res) {
  try {
    const employeesList = await EmployeeLeavesRecord.findAll({
      attributes: [
        "no_of_days",
        "id",
        "status_type_id",
        [Sequelize.literal("from_date"), "start"],
        [Sequelize.literal("to_date"), "end"],
        [Sequelize.literal("EmployeeInformation.first_name"), "title"],
        [Sequelize.literal("EmployeeInformation.last_name"), "lastname"],
      ],
      include: [
        {
          model: EmployeeInformation,
          attributes: [],
        },
      ],

      where: { status_type_id: 3 },
    });

    if (!employeesList) {
      const resp = getResponse({}, 400, "Error while fetched record");
      return res.status(200).send(resp);
    }
    const resp = getResponse(employeesList, 200, "Record fetched successfully");

    return res.status(200).send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, "Something went wrong");
    res.send(resp);
  }
}

async function getEmployeeLogsForMobile(req, res) {
  try {
    const employeeID = parseInt(req.params.id);

    const activityLogs = await db.sequelize.query(
      EMPLOYEE_ACTIVITY_LOGS_MOBILE_QUERY,
      {
        type: QueryTypes.SELECT,
        replacements: { employeeID },
      }
    );

    if (!activityLogs.length) {
      const resp = getResponse(null, 404, "No Logs Found");
      return res.send(resp);
    }

    const resp = getResponse(activityLogs, 200, "success");
    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, "Something went wrong");
    console.error(err);
    res.send(resp);
  }
}

module.exports = {
  addNewEmployee,
  getAllEmployees,
  getEmployeeByID,
  editEmployeeInformation,
  updateEmployeeStatus,
  employeeListForCalendar,
  getEmployeeLogsForMobile,
};
