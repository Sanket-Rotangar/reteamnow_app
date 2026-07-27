// config/api.ts
// API configuration loaded from environment variables
// Configure these in your .env file (see .env.example)

import { API_BASE_URL } from '@env';
export { API_BASE_URL };

export const API_TIMEOUT = 10000; // 10 seconds
export const API_VERSION = 'v1';
