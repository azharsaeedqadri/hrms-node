"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EmployeeLeavesRecord extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EmployeeLeavesRecord.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      employee_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      leave_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      from_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      to_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      no_of_days: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      attachment: DataTypes.INTEGER,
      reason: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      approved_date: DataTypes.DATE,
      approved_by: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "EmployeeLeavesRecord",
      tableName: "employee_leaves_record",
    }
  );
  return EmployeeLeavesRecord;
};
