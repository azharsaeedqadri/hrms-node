"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EmployeeInformationAudit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EmployeeInformationAudit.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      employee_id: DataTypes.BIGINT,
      employee_code: DataTypes.STRING,
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      is_active: DataTypes.BOOLEAN,
      updated_date: DataTypes.DATE,
      updated_by: DataTypes.STRING,
      action_performed: DataTypes.STRING,
      salutation_id: DataTypes.INTEGER,
      employee_type_id: DataTypes.INTEGER,
      middle_name: DataTypes.STRING,
      cnic_number: DataTypes.STRING,
      date_of_birth: DataTypes.DATE,
      gender_id: DataTypes.INTEGER,
      marital_status_id: DataTypes.INTEGER,
      mobile_number: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      present_address: DataTypes.STRING,
      present_city: DataTypes.STRING,
      permanent_address: DataTypes.STRING,
      permanent_city: DataTypes.STRING,
      emergency_contact: DataTypes.STRING,
      personal_email: DataTypes.STRING,
      office_email: DataTypes.STRING,
      joining_date: DataTypes.DATE,
      designation_id: DataTypes.INTEGER,
      department_id: DataTypes.INTEGER,
      role_id: DataTypes.INTEGER,
      team_id: DataTypes.INTEGER,
      salary_type_id: DataTypes.INTEGER,
      company_id: DataTypes.INTEGER,
      current_salary: DataTypes.INTEGER,
      gross_salary: DataTypes.INTEGER,
      hourly_rate: DataTypes.FLOAT,
      basic_salary: DataTypes.INTEGER,
      leave_balance: DataTypes.INTEGER,
      ipd_balance: DataTypes.INTEGER,
      opd_balance: DataTypes.INTEGER,
      currency_type: DataTypes.INTEGER,
      project_manager: DataTypes.BIGINT,
      resignation_reason: DataTypes.STRING,
      resignation_date: DataTypes.DATE,
      rejoining_reason: DataTypes.STRING,
      rejoining_date: DataTypes.DATE,
      blood_group: DataTypes.STRING,
      is_probation_completed: DataTypes.BOOLEAN,
      bank_id: DataTypes.INTEGER,
      acc_title: DataTypes.STRING,
      acc_number: DataTypes.STRING,
      photo: DataTypes.STRING,
      prev_experience: DataTypes.STRING,
      education_type_id: DataTypes.INTEGER,
      institute: DataTypes.STRING,
      edu_attachment: DataTypes.STRING,
      resume: DataTypes.STRING,
      is_deleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "EmployeeInformationAudit",
      tableName: "employee_information_audit",
      timestamps: false,
    }
  );
  return EmployeeInformationAudit;
};
