export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws';

export const MESSAGE_STATUS = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read'
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'chatai_auth_token',
  REMEMBER_ME: 'chatai_remember_me',
  USER: 'chatai_user'
};
