"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AccountHead extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AccountHead.init(
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      basic_pay: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      house_rent: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      medical_allowance: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      utility_allowance: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "AccountHead",
      tableName: "account_heads",
    }
  );
  return AccountHead;
};
