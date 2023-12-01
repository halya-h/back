// const {Schema, model} = require('pg')
//
//
// const User = new Schema({
//     username: {type: String, unique: true, required: true},
//     password: {type: String, required: true},
//     roles: [{type: String, ref: 'Role'}]
// })
//
// module.exports = model('User', User)

const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Import your database connection configuration

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // Define other fields as needed
});

module.exports = User;
