// export const url = 'https://chat-app-server.fly.dev';
export const apiUrl = process.env.NODE_ENV === 'production' ? 'api' : 'http://localhost:5900/api';
export const socketUrl = process.env.NODE_ENV === 'production' ? 'chat-app' : 'http://localhost:5900/chat-app';
