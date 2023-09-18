const jwt = require("jsonwebtoken");

const getResponse = (data, code, message) => {
  return { data, code, message };
};

const getUserIDByBearerToken = (token) => {
  try {
    const decoded = jwt.decode(token);

    return decoded.user_id;
  } catch (err) {
    console.error("Error: ", err);
  }
};

const calculateOvertime = (numberOfHours, grossSalary) => {
  const annualSalary = grossSalary * 12;
  const weeklySalary = annualSalary / 52;
  const dailySalary = weeklySalary / 5;
  const hourlyRate = dailySalary / 8;
  // in overtime the hourly rate is doubled
  const doubleHourlyRate = hourlyRate * 2;

  return numberOfHours * doubleHourlyRate;
};

//EPF stands for Employee Provident Fund
const calculateEPF = (basicSalary, epfPercentage) => {
  const percent = epfPercentage / 100;
  return basicSalary * percent;
};

const calculateLeaveEncashments = (leaveBalance, hourlyRate) => {
  return leaveBalance * hourlyRate * 8;
};

const calculateAnnualTax = (taxSlab, annualGrossSalary) => {
  var exceedAmount = annualGrossSalary - taxSlab.minimum_income;
  var percentAmount = exceedAmount * taxSlab.percentage / 100;
  var annualTax = taxSlab.minimum_income > 0 ? percentAmount + taxSlab.additional_amount : 0;
  return annualTax;
};

module.exports = {
  getResponse,
  getUserIDByBearerToken,
  calculateOvertime,
  calculateEPF,
  calculateLeaveEncashments,
  calculateAnnualTax
};
