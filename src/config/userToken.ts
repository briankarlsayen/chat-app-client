import { generateUUID } from '../utilities/generator';

export const initializeUserToken = () => {
  const tokenExist = localStorage.getItem('userToken');
  if (!tokenExist) {
    let token = generateUUID();
    localStorage.setItem('userToken', token);
    return token;
  }
  return tokenExist;
};

export const userToken = localStorage.getItem('userToken');
