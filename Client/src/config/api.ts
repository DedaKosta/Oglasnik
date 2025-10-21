export const API_CONFIG = {
  baseURL: 'http://localhost:5030',
  endpoints: {
    register: '/api/register',
    login: '/api/login',
    health: '/api/health',
  },
} as const
