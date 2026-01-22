import { testConnection } from '../config/database.js';

async function testSequelizeConnection() {
    const isConnected = await testConnection();
    if (!isConnected) {
        throw new Error('Sequelize failed to connect to the database');
    }
    console.log('Sequelize connection test passed');
    await testConnection.close();
}