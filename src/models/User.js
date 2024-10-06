// models/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../lib/db');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = User;
