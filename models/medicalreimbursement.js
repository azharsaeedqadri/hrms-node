"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MedicalReimbursement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.MedicalReimbursement.belongsTo(models.EmployeeInformation, {
        foreignKey: "employee_id",
      });
      models.EmployeeInformation.hasMany(models.MedicalReimbursement, {
        foreignKey: "employee_id",
      });

      models.MedicalReimbursement.belongsTo(models.StatusType, {
        foreignKey: "status",
      });
      models.StatusType.hasMany(models.MedicalReimbursement, {
        foreignKey: "id",
      });
    }
  }
  MedicalReimbursement.init(
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      reimbursement_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      status: DataTypes.INTEGER,
      pdf_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      employee_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "MedicalReimbursement",
      tableName: "medical_reimbursements",
    }
  );
  return MedicalReimbursement;
};
