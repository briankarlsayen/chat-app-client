import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://chat-app-server-nu-henna.vercel.app',
  // baseURL: 'http://localhost:5900',
});

export default instance;
