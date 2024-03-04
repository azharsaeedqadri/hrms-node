"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Techstack extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */    
  }
  Techstack.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,  
    },
    {
      sequelize,
      modelName: "Techstack",
      tableName: "techstacks",
    }
  );
  return Techstack;
};
