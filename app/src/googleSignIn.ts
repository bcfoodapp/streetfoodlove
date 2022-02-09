// Logs in with Google account, creating an account if necessary. On success, token in store is set. Given token is the
// one that Google provides.
import jwtDecode from "jwt-decode";

interface GoogleClaims {
  family_name: string;
  given_name: string;
  email: string;
}

export function signInWithGoogle(token: string) {
  console.log("token:", jwtDecode<GoogleClaims>(token));
}
