/**
 * API Configuration
 * Centralized configuration for API endpoints
 */

// Base URL for the API 
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// API Endpoints
export const API_ENDPOINTS = {
    // User endpoints
    users: {
        base: '/users',
        byId: (id) => `/users/${id}`,
        login: '/users/login'
    },

    // Character endpoints
    characters: {
        base: '/characters',
        byId: (id) => `/characters/${id}`,
        byUser: (userId) => `/characters/user/${userId}`
    },

    // Class Reference endpoints
    classes: {
        base: '/classes',
        byId: (id) => `/classes/${id}`
    },

    // Ability endpoints
    abilities: {
        base: '/abilities',
        byId: (id) => `/abilities/${id}`,
        byClass: (classId) => `/abilities/class/${classId}`
    },

    // Character Classes endpoints
    characterClasses: {
        base: '/character-classes',
        byCharacter: (characterId) => `/character-classes/character/${characterId}`
    },

    // Character Abilities endpoints
    characterAbilities: {
        base: '/character-abilities',
        byCharacter: (characterId) => `/character-abilities/character/${characterId}`
    }
};

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 10000;

export default {
    API_BASE_URL,
    API_ENDPOINTS,
    REQUEST_TIMEOUT
};
