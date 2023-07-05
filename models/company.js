"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Company.init(
    {
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      company_name: DataTypes.STRING,
      company_email: DataTypes.STRING,
      company_address: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Company",
      tableName: "companies",
    }
  );
  return Company;
};
