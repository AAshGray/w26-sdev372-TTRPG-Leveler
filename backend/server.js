/**
 * Express Server
 * Main backend server for TTRPG Character Leveler
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';
import characterRoutes from './routes/characters.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for frontend
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/characters', characterRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'TTRPG Leveler API is running',
        timestamp: new Date().toISOString()
    });
});

// API Root response
const rootHandler = (req, res) => {
    res.json({
        message: 'TTRPG Character Leveler API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            characters: '/api/characters'
        }
    });
};

// API Root endpoint
app.get('/api', rootHandler);

// Root endpoint
app.get('/', rootHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: `Route ${req.method} ${req.path} not found`
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

// Start server
async function startServer() {
    // Test database connection first
    const dbConnected = await testConnection();

    if (!dbConnected) {
        console.error('Server starting without database connection');
        console.error('Please check your database configuration in .env file');
    }

    app.listen(PORT, () => {
        console.log(`Server running!`);
        console.log(`Local:   http://localhost:${PORT}`);
        console.log(`Docker:  http://localhost:8080 (via Nginx)`);
        console.log(`API:     http://localhost:${PORT}/api`);
    });
}

startServer();
