/**
 * Character Controller
 * Handles API requests for characters
 */
import apiService from '../services/apiService.js';
import { API_ENDPOINTS } from '../config/apiConfig.js';
import Character from '../models/Character.js';

class CharacterController {
    /**
     * Get a single character by ID
     */
    async getCharacter(id) {
        try {
            const data = await apiService.get(API_ENDPOINTS.characters.byId(id));
            return new Character(data);
        } catch (error) {
            console.error(`Failed to fetch character ${id}:`, error);
            throw error;
        }
    }

    /**
     * Get all characters for a user (when we have more characters)
     */
    async getCharactersByUser(userId) {
        try {
            const data = await apiService.get(API_ENDPOINTS.characters.byUser(userId));
            return data.map(char => new Character(char));
        } catch (error) {
            console.error(`Failed to fetch characters for user ${userId}:`, error);
            throw error;
        }
    }

    /**
     * Get all characters (when we have more characters)
     */
    async getAllCharacters() {
        try {
            const data = await apiService.get(API_ENDPOINTS.characters.base);
            return data.map(char => new Character(char));
        } catch (error) {
            console.error('Failed to fetch all characters:', error);
            throw error;
        }
    }
}

// Export singleton instance
const characterController = new CharacterController();
export default characterController;
