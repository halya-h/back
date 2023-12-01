const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Import your Sequelize instance

const Role = sequelize.define('Role', {
    value: {
        type: DataTypes.STRING,
        unique: true,
        defaultValue: "USER", // Note: Sequelize uses `defaultValue` instead of `default`
    },
});

module.exports = Role;
