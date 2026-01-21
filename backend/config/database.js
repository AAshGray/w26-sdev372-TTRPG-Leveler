// import mysql from 'mysql2/promise';
import {Sequelize} from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// // Create connection pool
// const pool = mysql.createPool({
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || '',
//     database: process.env.DB_NAME || 'ttrpg_leveler',
//     port: process.env.DB_PORT || 3306,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

const sequelize = new Sequelize(
  process.env.DB_NAME || 'ttrpg_leveler',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    dialect: 'mysql',
    logging: false
  }
);

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully');
        return true;
    } catch (error) {
        console.error('Database connection failed:', error.message);
        return false;
    }
}

export { sequelize, testConnection };
