const Pool = require('pg').Pool
//require('dotenv').config()

const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'postgres'
})

module.exports = pool
// pool.query('SELECT * FROM test')
//     .then(result => {
//         // Обробка результату запиту
//         const rows = result.rows;
//
//         if (rows.length > 0) {
//             console.log('Data from the "test" table:');
//             rows.forEach(row => {
//                 console.log(row);
//             });
//         } else {
//             console.log('No data found in the "test" table.');
//         }
//     })
//     .catch(error => {
//         console.error('Error connecting to the database:', error);
//     })
//     .finally(() => {
//         // Завершення підключення (необов'язково, бо пул самостійно керує з'єднаннями)
//         pool.end();
//     });
// Import necessary modules
// const { Sequelize } = require('sequelize');
//
// const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/postgres', {
//     dialect: 'postgres',
//     dialectOptions: {
//         ssl: false, // Встановіть на true, якщо використовуєте SSL
//     },
// });
// // Test the connection
// sequelize.authenticate().then(() => {
//     console.log('Connection has been established successfully.');
// }).catch((err) => {
//     console.error('Unable to connect to the database:', err);
// });
//
// module.exports = sequelize;