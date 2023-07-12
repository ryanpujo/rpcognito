import generateToken from './generate-token.js';
import sign from './sign.js';
import signUp from './sign-up.js';
import getIdToken from './getid-token.js';
import { encryptMessage, decryptMessage } from './encryption.js';
import signIn from './sign-in.js';

export const authService = {
  signUp,
  sign,
  generateToken,
  signIn,
  getIdToken,
  encryptMessage,
  decryptMessage,
};
