const { DataTypes } = require("sequelize");

const sequelize = require("../db/conn");

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
  },
});

module.exports = User;

