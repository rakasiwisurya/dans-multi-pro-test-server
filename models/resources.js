"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class resources extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      resources.belongsTo(models.jobs, {
        as: "job",
        foreignKey: {
          name: "jobId",
        },
      });
    }
  }
  resources.init(
    {
      jobId: DataTypes.INTEGER,
      resource: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "resources",
    }
  );
  return resources;
};
