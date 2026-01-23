/**
 * Character Routes
 * API endpoints for character CRUD operations
 */
import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

/**
 * GET /api/characters/:id
 * Get a single character by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query(
            'SELECT * FROM characters WHERE id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: 'Character not found',
                message: `No character found with ID ${id}`
            });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching character:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

/**
 * GET /api/characters
 * Get all characters
 */
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM characters');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching characters:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

/**
 * GET /api/characters/user/:userId
 * Get all characters for a specific user
 */
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const [rows] = await pool.query(
            'SELECT * FROM characters WHERE user_id = ?',
            [userId]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error fetching user characters:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

export default router;
