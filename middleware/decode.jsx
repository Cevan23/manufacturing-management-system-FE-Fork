import { SECRET_KEY } from '@env';
import JWT from 'expo-jwt';

// This function decodes a given JWT token using the SECRET_KEY
// Author: Pham Van Cao
export const decodeJwtMiddleware = async (token) => {
  if (token) {
    try {
      const decodedToken = JWT.decode(token, SECRET_KEY);
      return decodedToken;
      
    } catch (error) {
      console.error(error);
    }
  }
  throw new Error('No token found in response ');
};