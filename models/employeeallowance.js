"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EmployeeAllowance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.EmployeeAllowance.hasMany(models.EmployeeInformation, {
        foreignKey: "employee_id",
      });
      models.EmployeeInformation.belongsTo(models.EmployeeAllowance, {
        foreignKey: "employee_id",
      });
      // define association here
    }
  }
  EmployeeAllowance.init(
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      allowance_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      employee_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      percentage: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "EmployeeAllowance",
      tableName: "employee_allowances",
    }
  );
  return EmployeeAllowance;
};
