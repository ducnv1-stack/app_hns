// Environment configuration
export const config = {
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  ENV: import.meta.env.MODE || 'development',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Hà Nội Sun Travel',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0'
};

export default config;
