import { generateUUID } from '../utilities/generator';

export let userToken = localStorage.getItem('userToken');

export const initializeUserToken = () => {
  const tokenExist = localStorage.getItem('userToken');
  if (!tokenExist) {
    let token = generateUUID();
    localStorage.setItem('userToken', token);
    userToken = token;
    return token;
  }
  return tokenExist;
};
