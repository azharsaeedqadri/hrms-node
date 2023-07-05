"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TotalLeaveDay extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TotalLeaveDay.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      leave_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      employee_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      no_of_days: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "TotalLeaveDay",
      tableName: "total_leave_days",
    }
  );
  return TotalLeaveDay;
};
