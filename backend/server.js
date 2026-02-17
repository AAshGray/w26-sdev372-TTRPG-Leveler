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
const BACKEND_PORT = process.env.BACKEND_PORT || 3000;
const HOST = process.env.NODE_ENV = 'production' ? '0.0.0.0' : 'localhost';
const API_BASE_URL = `http://${HOST}:${BACKEND_PORT}/api`;

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

// API Root endpoint
app.get('/api', (req, res) => {
    res.json({
        message: 'TTRPG Character Leveler API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            characters: '/api/characters'
        }
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'TTRPG Character Leveler API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            characters: '/api/characters'
        }
    });
});

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
        console.error('⚠️  Server starting without database connection');
        console.error('Please check your database configuration in .env file');
    }

    app.listen(BACKEND_PORT, '0.0.0.0', () => {
        console.log(`\n🚀 Server running on ${API_BASE_URL}`);
        console.log(`📊 API endpoints available at ${API_BASE_URL}`);
        console.log(`\nPress Ctrl+C to stop the server\n`);
    });
}

startServer();
