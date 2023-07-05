"use strict";
const { UUIDV4 } = require("sequelize");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class HrUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  HrUser.init(
    {
      user_id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: UUIDV4,
      },
      employee_id: DataTypes.BIGINT,
      username: { type: DataTypes.STRING, allowNull: false },
      email: DataTypes.STRING,
      password: { type: DataTypes.STRING, allowNull: false },
      first_name: { type: DataTypes.STRING, allowNull: false },
      last_name: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.INTEGER, allowNull: false },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_by: DataTypes.STRING,
      updated_by: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "HrUser",
      tableName: "hr_users",
    }
  );
  return HrUser;
};
