// config/api.ts

// Development API URL
const DEV_API_URL = 'http://10.0.0.135:8062/api'; //replace with your network id

// For now, we're using development URL
// Later you can switch based on environment or build configuration
export const API_BASE_URL = DEV_API_URL;

// You can also export other API-related constants
export const API_TIMEOUT = 10000; // 10 seconds
export const API_VERSION = 'v1';
