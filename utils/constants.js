const SUPER_ADMIN = 1;
const HR = 2;
const PM = 3;
const DEVELOPER = 4;

const GET_ALL_EMPLOYEES_QUERY = `SELECT employee_information.[employee_id], 
salutations.[name] as salutation, 
employee_information.[employee_code], 
employee_types.[name] as employeeType,
employee_information.[first_name], 
employee_information.[middle_name], 
employee_information.[last_name], 
employee_information.[cnic_number], 
employee_information.[date_of_birth], 
genders.[name] as gender, 
marital_statuses.[name] as maritalStatus, 
employee_information.[mobile_number], 
employee_information.[phone_number], 
employee_information.[present_address], 
employee_information.[present_city], 
employee_information.[permanent_address], 
employee_information.[permanent_city], 
employee_information.[emergency_contact], 
employee_information.[personal_email], 
employee_information.[office_email], 
employee_information.[joining_date], 
designations.[name] as designation, 
departments.[name] as department, 
role_types_employees.[name] as [role],
teams.[name] as team,
salary_types.[name] as salaryType, 
employee_information.[current_salary], 
employee_information.[gross_salary],
employee_information.[company_id],
employee_information.[basic_salary], 
currency_types.[name] as currencyType, 
employee_information.[project_manager], 
employee_information.[resignation_date], 
employee_information.[rejoining_date], 
employee_information.[blood_group], 
employee_information.[is_probation_completed], 
bank_types.[name] as bank, 
employee_information.[acc_title], 
employee_information.[acc_number], 
employee_information.[photo], 
employee_information.[prev_experience], 
education_types.[name] as education, 
employee_information.[institute], 
employee_information.[edu_attachment], 
employee_information.[resume], 
employee_information.[is_deleted], 
employee_information.[is_active], 
employee_information.[createdBy], 
employee_information.[updatedBy], 
employee_information.[createdAt], 
employee_information.[updatedAt] 
FROM [employee_information]
LEFT JOIN salutations ON employee_information.salutation_id=salutations.id
LEFT JOIN employee_types ON employee_information.employee_type_id=employee_types.id
LEFT JOIN genders ON employee_information.gender_id=genders.id
LEFT JOIN marital_statuses ON employee_information.marital_status_id=marital_statuses.id
LEFT JOIN designations ON employee_information.designation_id=designations.id
LEFT JOIN departments ON employee_information.department_id=departments.id
LEFT JOIN role_types_employees ON employee_information.role_id=role_types_employees.id
LEFT JOIN teams ON employee_information.team_id=teams.id
LEFT JOIN salary_types ON employee_information.salary_type_id=salary_types.id
LEFT JOIN currency_types ON employee_information.currency_type=currency_types.id
LEFT JOIN bank_types ON employee_information.bank_id=bank_types.id
LEFT JOIN education_types ON employee_information.education_type_id=education_types.id`;

const GET_EMPLOYEE_BY_ID = `SELECT employee_information.[employee_id], 
salutations.[name] as salutation, 
salutations.[id] as salutation_id, 
employee_information.[employee_code], 
employee_types.[name] as employeeType,
employee_types.[id] as employeeType_id,
employee_information.[first_name], 
employee_information.[middle_name], 
employee_information.[last_name], 
employee_information.[cnic_number], 
employee_information.[date_of_birth], 
genders.[name] as gender, 
genders.[id] as gender_id, 
marital_statuses.[name] as maritalStatus, 
marital_statuses.[id] as maritalStatus_id, 
employee_information.[mobile_number], 
employee_information.[phone_number], 
employee_information.[present_address], 
employee_information.[present_city], 
employee_information.[permanent_address], 
employee_information.[permanent_city], 
employee_information.[emergency_contact], 
employee_information.[personal_email], 
employee_information.[office_email], 
employee_information.[joining_date], 
designations.[name] as designation, 
designations.[id] as designation_id, 
departments.[name] as department, 
departments.[id] as department_id, 
role_types_employees.[id] as role_id,
role_types_employees.[name] as [role],
teams.[id] as team_id,
teams.[name] as team,
salary_types.[name] as salaryType, 
salary_types.[id] as salaryType_id, 
employee_information.[current_salary], 
employee_information.[gross_salary],
employee_information.[company_id],
employee_information.[basic_salary], 
currency_types.[name] as currencyType, 
currency_types.[id] as currencyType_id, 
employee_information.[project_manager], 
employee_information.[resignation_date], 
employee_information.[rejoining_date], 
employee_information.[blood_group], 
employee_information.[is_probation_completed], 
bank_types.[id] as bank_id,
bank_types.[name] as bank, 
employee_information.[acc_title], 
employee_information.[acc_number], 
employee_information.[photo], 
employee_information.[prev_experience], 
education_types.[name] as education, 
education_types.[id] as education_id, 
employee_information.[institute], 
employee_information.[edu_attachment], 
employee_information.[resume], 
employee_information.[is_deleted], 
employee_information.[is_active], 
employee_information.[createdBy], 
employee_information.[updatedBy], 
employee_information.[createdAt], 
employee_information.[updatedAt] 
FROM [employee_information]
LEFT JOIN salutations ON employee_information.salutation_id=salutations.id
LEFT JOIN employee_types ON employee_information.employee_type_id=employee_types.id
LEFT JOIN genders ON employee_information.gender_id=genders.id
LEFT JOIN marital_statuses ON employee_information.marital_status_id=marital_statuses.id
LEFT JOIN designations ON employee_information.designation_id=designations.id
LEFT JOIN departments ON employee_information.department_id=departments.id
LEFT JOIN role_types_employees ON employee_information.role_id=role_types_employees.id
LEFT JOIN teams ON employee_information.team_id=teams.id
LEFT JOIN salary_types ON employee_information.salary_type_id=salary_types.id
LEFT JOIN currency_types ON employee_information.currency_type=currency_types.id
LEFT JOIN bank_types ON employee_information.bank_id=bank_types.id
LEFT JOIN education_types ON employee_information.education_type_id=education_types.id
WHERE employee_information.employee_id = :employeeID`;

const GET_LEAVES_REQUEST_LIST_QUERY = `SELECT [employee_leaves_record].[id] as leaveID,
[employee_information].[employee_id] as employeeID,
[employee_information].[first_name] as employeeFirstName,
[employee_information].[last_name] as employeeLastName,
[employee_information].[personal_email] as employeePersonalEmail,
[employee_information].[photo] as profilePicture,
[designations].[name] as designation,
[leave_types].[name] as leaveType,
[employee_leaves_record].[from_date] as fromDate, 
[employee_leaves_record].[to_date] as toDate, 
[employee_leaves_record].[no_of_days] as numberOfDays, 
[status_types].[name] as [status], 
[employee_leaves_record].[attachment], 
[employee_leaves_record].[reason], 
[employee_leaves_record].[is_deleted], 
[employee_leaves_record].[approved_date], 
[employee_leaves_record].[approved_by], 
[employee_leaves_record].[createdAt], 
[employee_leaves_record].[updatedAt]
FROM [employee_leaves_record]
LEFT JOIN employee_information ON [employee_leaves_record].employee_id=employee_information.employee_id
LEFT JOIN leave_types ON [employee_leaves_record].leave_type_id=leave_types.id
LEFT JOIN status_types ON [employee_leaves_record].status_type_id=status_types.id
LEFT JOIN designations ON [employee_information].designation_id=designations.id
WHERE employee_leaves_record.status_type_id = :statusType`;

const LEAVE_RECORD_BY_EMPLOYEE_ID_QUERY = `SELECT [employee_leaves_record].[id] as leaveID,
[employee_information].[employee_id] as employeeID,
[employee_information].[employee_code] as employeeCode,
[employee_information].[joining_date] as joiningDate,
[employee_information].[first_name] as employeeFirstName,
[employee_information].[last_name] as employeeLastName,
[employee_information].[personal_email] as employeePersonalEmail,
[employee_information].[photo] as profilePicture,
[designations].[name] as designation,
[leave_types].[name] as leaveType,
[employee_leaves_record].[from_date] as fromDate, 
[employee_leaves_record].[to_date] as toDate, 
[employee_leaves_record].[no_of_days] as numberOfDays, 
[status_types].[name] as [status], 
[employee_leaves_record].[attachment], 
[employee_leaves_record].[reason], 
[employee_leaves_record].[is_deleted], 
[employee_leaves_record].[approved_date], 
[employee_leaves_record].[approved_by], 
[employee_leaves_record].[createdAt], 
[employee_leaves_record].[updatedAt]
FROM [employee_leaves_record]
LEFT JOIN employee_information ON [employee_leaves_record].employee_id=employee_information.employee_id
LEFT JOIN leave_types ON [employee_leaves_record].leave_type_id=leave_types.id
LEFT JOIN status_types ON [employee_leaves_record].status_type_id=status_types.id
LEFT JOIN designations ON [employee_information].designation_id=designations.id
WHERE employee_leaves_record.employee_id = :employeeID
ORDER BY createdAt DESC`;

const FINALIZED_LEAVE_RECORDS_BY_EMPLOYEE_ID_QUERY = `SELECT [employee_leaves_record].[id] as leaveID,
[employee_information].[employee_id] as employeeID,
[employee_information].[employee_code] as employeeCode,
[employee_information].[joining_date] as joiningDate,
[employee_information].[first_name] as employeeFirstName,
[employee_information].[last_name] as employeeLastName,
[employee_information].[personal_email] as employeePersonalEmail,
[employee_information].[photo] as profilePicture,
[designations].[name] as designation,
[leave_types].[name] as leaveType,
[employee_leaves_record].[from_date] as fromDate, 
[employee_leaves_record].[to_date] as toDate, 
[employee_leaves_record].[no_of_days] as numberOfDays, 
[status_types].[name] as [status], 
[employee_leaves_record].[attachment], 
[employee_leaves_record].[reason], 
[employee_leaves_record].[is_deleted], 
[employee_leaves_record].[approved_date], 
[employee_leaves_record].[approved_by], 
[employee_leaves_record].[createdAt], 
[employee_leaves_record].[updatedAt]
FROM [employee_leaves_record]
LEFT JOIN employee_information ON [employee_leaves_record].employee_id=employee_information.employee_id
LEFT JOIN leave_types ON [employee_leaves_record].leave_type_id=leave_types.id
LEFT JOIN status_types ON [employee_leaves_record].status_type_id=status_types.id
LEFT JOIN designations ON [employee_information].designation_id=designations.id
WHERE employee_leaves_record.employee_id = :employeeID AND employee_leaves_record.status_type_id = 3`;

const LEAVE_RECORD_BY_LEAVE_ID_QUERY = `SELECT [employee_leaves_record].[id] as leaveID,
[employee_information].[employee_id] as employeeID,
[employee_information].[employee_code] as employeeCode,
[employee_information].[joining_date] as joiningDate,
[employee_information].[first_name] as employeeFirstName,
[employee_information].[last_name] as employeeLastName,
[employee_information].[personal_email] as employeePersonalEmail,
[employee_information].[photo] as profilePicture,
[designations].[name] as designation,
[leave_types].[name] as leaveType,
[employee_leaves_record].[from_date] as fromDate, 
[employee_leaves_record].[to_date] as toDate, 
[employee_leaves_record].[no_of_days] as numberOfDays, 
[status_types].[id] as [statusID], 
[status_types].[name] as [status],
[employee_leaves_record].[attachment], 
[employee_leaves_record].[reason], 
[employee_leaves_record].[is_deleted], 
[employee_leaves_record].[approved_date], 
[employee_leaves_record].[approved_by], 
[employee_leaves_record].[createdAt], 
[employee_leaves_record].[updatedAt]
FROM [employee_leaves_record]
LEFT JOIN employee_information ON [employee_leaves_record].employee_id=employee_information.employee_id
LEFT JOIN leave_types ON [employee_leaves_record].leave_type_id=leave_types.id
LEFT JOIN status_types ON [employee_leaves_record].status_type_id=status_types.id
LEFT JOIN designations ON [employee_information].designation_id=designations.id
WHERE employee_leaves_record.id = :leaveID`;

const LEAVE_REASONS_BY_LEAVE_ID_QUERY = `SELECT [leave_reasons].[id],
[hr_users].[first_name] as addedByFirstName,
[hr_users].[last_name] as addedByLastName,
[role_types].[name] as [role],
[leave_reasons].[leave_id], 
[leave_reasons].[reason], 
[leave_reasons].[createdAt] as addedDate
FROM [leave_reasons]
LEFT JOIN [hr_users] ON [leave_reasons].[user_id] = [hr_users].[user_id] 
LEFT JOIN [role_types] ON [hr_users].[role] = [role_types].[id]
WHERE [leave_reasons].[leave_id] = :leaveID
ORDER BY [leave_reasons].[createdAt] DESC`;

const GET_TEAMS_QUERY = `SELECT [teams].[id],
[teams].[name],
[teams].[description],
[departments].[name] AS department,
[teams].[is_deleted],
[teams].[createdAt],
[teams].[updatedAt]
FROM [teams] 
LEFT JOIN departments ON teams.department_id=departments.id
WHERE [teams].[is_deleted] = 0`;

const GET_CREATED_EMPLOYEE_ALLOWANCES = `select employee_allowances.allowance_id,
allowances.[name],
allowances.[description],
allowance_and_deduction_types.[name] as [type],
employee_allowances.[percentage]
from employee_allowances
left join allowances ON allowances.allowance_id = employee_allowances.allowance_id
left join allowance_and_deduction_types ON allowance_and_deduction_types.id = allowances.allowance_type
where employee_id = :employee_id`;

module.exports = {
  SUPER_ADMIN,
  HR,
  PM,
  DEVELOPER,
  GET_ALL_EMPLOYEES_QUERY,
  GET_EMPLOYEE_BY_ID,
  GET_LEAVES_REQUEST_LIST_QUERY,
  LEAVE_RECORD_BY_EMPLOYEE_ID_QUERY,
  LEAVE_RECORD_BY_LEAVE_ID_QUERY,
  LEAVE_REASONS_BY_LEAVE_ID_QUERY,
  FINALIZED_LEAVE_RECORDS_BY_EMPLOYEE_ID_QUERY,
  GET_TEAMS_QUERY,
  GET_CREATED_EMPLOYEE_ALLOWANCES,
};
