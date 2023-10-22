import axios from 'axios';
import { apiUrl } from '../config/server';

const instance = axios.create({
  baseURL: apiUrl,
});

export default instance;
