const {
  EmployeeInformation,
  EmployeeLeavesRecord,
  HrUser,
  BankType,
  CurrencyType,
  EducationType,
  Gender,
  LeaveType,
  MaritalStatus,
  SalaryType,
  Salutation,
  Department,
  Designation,
  EmployeeType,
  StatusType,
  RoleType,
  RoleTypeEmployee,
  Team,
  Month,
  AllowanceAndDeductionType,
  MedicalLimit,
  MedicalReimbursement,
} = require('../models');
const { HR, TOTAL_LEAVES } = require('../utils/constants');
const {
  getResponse,
  getUserIDByBearerToken,
} = require('../utils/valueHelpers');

async function getAllDropdownData(req, res) {
  try {
    const [
      bank_types,
      currency_types,
      departments,
      designations,
      education_types,
      gender,
      leave_types,
      marital_statuses,
      salary_types,
      salutations,
      employeeTypes,
      statusTypes,
      roleTypes,
      roleTypeEmployees,
      teams,
      months,
      allowanceAndDeductionTypes,
      medical_limits,
    ] = await Promise.all([
      BankType.findAll({ where: { is_deleted: false } }),
      CurrencyType.findAll({ where: { is_deleted: false } }),
      Department.findAll({ where: { is_deleted: false } }),
      Designation.findAll({ where: { is_deleted: false } }),
      EducationType.findAll({ where: { is_deleted: false } }),
      Gender.findAll({ where: { is_deleted: false } }),
      LeaveType.findAll({ where: { is_deleted: false } }),
      MaritalStatus.findAll({ where: { is_deleted: false } }),
      SalaryType.findAll({ where: { is_deleted: false } }),
      Salutation.findAll({ where: { is_deleted: false } }),
      EmployeeType.findAll({ where: { is_deleted: false } }),
      StatusType.findAll({ where: { is_deleted: false } }),
      RoleType.findAll({ where: { is_deleted: false } }),
      RoleTypeEmployee.findAll({ where: { is_deleted: false } }),
      Team.findAll({ where: { is_deleted: false } }),
      Month.findAll({ where: { is_deleted: false } }),
      AllowanceAndDeductionType.findAll({ where: { is_deleted: false } }),
      MedicalLimit.findAll(),
    ]);

    const dropdownsData = {
      bank_types,
      currency_types,
      departments,
      designations,
      education_types,
      gender,
      leave_types,
      marital_statuses,
      salary_types,
      salutations,
      employeeTypes,
      statusTypes,
      roleTypes,
      roleTypeEmployees,
      teams,
      months,
      allowanceAndDeductionTypes,
      total_leaves_count: TOTAL_LEAVES,
      medical_limits,
    };

    const resp = getResponse(dropdownsData, 200, 'Lists fetched successfully');

    return res.status(200).send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    console.error(err);
    res.send(resp);
  }
}

async function getDashboardData(req, res) {
  try {
    const token = req.header('authorization').split('Bearer ');

    const userID = getUserIDByBearerToken(token[1]);

    const adminUser = await HrUser.findByPk(userID);

    const [
      employeeInformation,
      pendingLeavesPM,
      pendingLeavesHR,
      reimbursements,
      departments,
    ] = await Promise.all([
      EmployeeInformation.findAll({ where: { is_deleted: false } }),
      EmployeeLeavesRecord.findAll({ where: { status_type_id: 1 } }),
      EmployeeLeavesRecord.findAll({ where: { status_type_id: 2 } }),
      MedicalReimbursement.findAll({ where: { status: 1 } }),
      Department.findAll({
        where: { is_deleted: false },
      }),
    ]);

    const totalEmployees = employeeInformation.length || 0;
    const totalPendingLeavesHR = pendingLeavesHR.length || 0;
    const totalPendingLeavesPM = pendingLeavesPM.length || 0;
    const totalPendingMedicalClaims = reimbursements.length || 0;
    const totalDepartments = departments.length || 0;

    const dashboardData = {
      totalEmployees,
      pendingLeaves:
        adminUser.role === HR ? totalPendingLeavesHR : totalPendingLeavesPM,
      totalPendingMedicalClaims,
      totalDepartments,
    };

    const resp = getResponse(dashboardData, 200, 'Lists fetched successfully');

    return res.status(200).send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    res.send(resp);
  }
}

module.exports = {
  getAllDropdownData,
  getDashboardData,
};
