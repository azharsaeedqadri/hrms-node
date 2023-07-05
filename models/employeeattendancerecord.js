"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EmployeeAttendanceRecord extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EmployeeAttendanceRecord.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      employee_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      checkin_time: DataTypes.DATE,
      checkout_time: DataTypes.DATE,
      hours_worked: DataTypes.TIME,
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "EmployeeAttendanceRecord",
      tableName: "employee_leaves_record",
      timestamps: true,
    }
  );
  return EmployeeAttendanceRecord;
};
