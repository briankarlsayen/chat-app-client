// export const url = 'https://chat-app-server.fly.dev';
export const url = process.env.NODE_ENV === 'production' ? 'api' : 'http://localhost:5900';
