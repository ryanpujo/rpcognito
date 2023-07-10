import getToken from "./get-token.js";
import signIn from "./sign-in.js";
import signOut from "./sign-out.js";
import signUp from "./sign-up.js";


export const authController = {
  signUp,
  signIn,
  getToken,
  signOut,
};
