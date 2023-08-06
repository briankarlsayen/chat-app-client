import axios from 'axios';
import { url } from '../config/server';

const instance = axios.create({
  baseURL: url,
});

export default instance;
