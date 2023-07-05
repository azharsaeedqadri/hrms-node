"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Allowance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Allowance.belongsTo(models.AllowanceAndDeductionType, {
        foreignKey: "allowance_type",
      });
      models.AllowanceAndDeductionType.hasMany(models.Allowance, {
        foreignKey: "allowance_type",
      });
    }
  }
  Allowance.init(
    {
      allowance_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      allowance_type: DataTypes.INTEGER,
      is_part_of_gross_salary: DataTypes.BOOLEAN,
      is_taxable: DataTypes.BOOLEAN,
      is_fixed: DataTypes.BOOLEAN,
      percentage: DataTypes.FLOAT,
      amount: DataTypes.FLOAT,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Allowance",
      tableName: "allowances",
    }
  );
  return Allowance;
};
