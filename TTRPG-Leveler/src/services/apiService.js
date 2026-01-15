/**
 * API Service
 * Handles all HTTP requests to the backend API.
 */
import { API_BASE_URL, REQUEST_TIMEOUT } from '../config/apiConfig.js';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.timeout = REQUEST_TIMEOUT;
        this.authToken = null;
    }

    /**
     * Set authentication token
     */
    setAuthToken(token) {
        this.authToken = token;
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    }

    /**
     * Get authentication token
     */
    getAuthToken() {
        if (!this.authToken) {
            this.authToken = localStorage.getItem('authToken');
        }
        return this.authToken;
    }

    /**
     * Build headers for requests
     */
    getHeaders(customHeaders = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...customHeaders
        };

        const token = this.getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    /**
     * Handle fetch with timeout
     */
    async fetchWithTimeout(url, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            throw error;
        }
    }

    /**
     * Handle API response
     */
    async handleResponse(response) {
        const contentType = response.headers.get('content-type');
        const isJson = contentType && contentType.includes('application/json');

        let data;
        if (isJson) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            const error = new Error(data.message || `HTTP Error: ${response.status}`);
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    }

    /**
     * GET request for the character sheet.
     */
    async get(endpoint, options = {}) {
        try {
            const url = `${this.baseURL}${endpoint}`;
            const response = await this.fetchWithTimeout(url, {
                method: 'GET',
                headers: this.getHeaders(options.headers),
                ...options
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('GET request failed:', error);
            throw error;
        }
    }

}

// Export singleton instance
const apiService = new ApiService();
export default apiService;
