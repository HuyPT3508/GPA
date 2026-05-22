const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

const dialect = process.env.DB_DIALECT || 'sqlite';

if (dialect === 'sqlite') {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: process.env.DB_STORAGE || 'database.sqlite',
        logging: false
    });
} else {
    // Standard connection for MySQL / PostgreSQL / MariaDB
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASS,
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 3306,
            dialect: dialect,
            logging: false,
            dialectOptions: process.env.DB_SSL === 'true' ? {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            } : {}
        }
    );
}

module.exports = sequelize;
