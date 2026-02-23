/**
 * Character Routes
 * API endpoints for character CRUD operations
 */
import express from 'express';
import * as charRepo from '../repos/characters.repo.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
//router.use(authenticate);

/**
 * GET /api/characters/:id
 * Get a single character by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Corrected name to match your characters.repo.js
        const character = await charRepo.findCharacterById(id);

        if (!character) {
            return res.status(404).json({
                error: 'Character not found',
                message: `Character with ID ${id} not found`
            });
        }

        res.json(character);
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
        // Reminder: Ensure you added this function to characters.repo.js
        const characters = await charRepo.findAllCharacters();
        res.json(characters);
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
        // Replaced pool.query with your repository method
        const characters = await charRepo.findAllCharactersByUserId(userId);

        res.json(characters);
    } catch (error) {
        console.error('Error fetching user characters:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

/**
 * POST /api/characters/create/character
 * Create a new character
 */
router.post('/create', authenticate, async (req, res) => {
    try {
        // Using the create method from your repo
        const newCharacter = await charRepo.createCharacter(req.body);
        res.status(201).json(newCharacter);
    } catch (error) {
        console.error('Error creating character:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

export default router;