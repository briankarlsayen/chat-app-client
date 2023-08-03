import axios from 'axios';

const instance = axios.create({
  // baseURL: 'http://localhost:5100/api',
  // baseURL: 'http://localhost:5081',
  // baseURL: 'https://barker-server-bd483ayno-briankarlsayen.vercel.app',
  // baseURL: "https://SmoggyFrighteningEnvironments.blu3fire89.repl.co",
  // baseURL: "https://openai-server.onrender.com",
  // baseURL: 'https://twitty-server-p6yjbz8no-briankarlsayen.vercel.app',
  // baseURL: 'https://openai-server-eight.vercel.app',
  baseURL: 'http://localhost:5900',
});

export default instance;
