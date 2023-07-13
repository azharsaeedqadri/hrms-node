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
const calculateEPF = (basicSalary) => {
  // epf is 8.334% of the basic salary
  const epfPercentage = 8.334 / 100;

  return basicSalary * epfPercentage;
};

const calculateLeaveEncashments = (leaveBalance, hourlyRate) => {
  return leaveBalance * hourlyRate;
};

module.exports = {
  getResponse,
  getUserIDByBearerToken,
  calculateOvertime,
  calculateEPF,
  calculateLeaveEncashments,
};
