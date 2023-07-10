import generateToken from "./generate-token.js";
import refreshToken from "./refresh-token.js";
import saveToken from "./save-token.js";
import signIn from "./sign-in.js";
import signUp from "./sign-up.js";
import getIdToken from "./getid-token.js";

export const authService = {
  signUp,
  signIn,
  saveToken,
  refreshToken,
  generateToken,
  getIdToken,
};
