import { testConnection } from '../config/database.js';

(async () => {
    const connected = await testConnection();
    if (!connected) process.exit(1);
})();