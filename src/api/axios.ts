import axios from 'axios';
import { url } from '../config/server';

const instance = axios.create({
  baseURL: url,
  // baseURL: 'http://localhost:5900',
});

export default instance;
