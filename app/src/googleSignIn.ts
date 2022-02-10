import jwtDecode from "jwt-decode";
import { useGetTokenWithGoogleMutation } from "./api";

// https://developers.google.com/identity/gsi/web/reference/js-reference#credential
interface GoogleClaims {
  family_name: string;
  given_name: string;
  email: string;
}

// Logs in with Google account, creating an account if necessary. The passed token is the one provided by Google using
// OAuth. On success, token in store is set.
export async function signInWithGoogle(
  token: string,
  getTokenWithGoogle: ReturnType<typeof useGetTokenWithGoogleMutation>[0]
) {
  const response = await getTokenWithGoogle(token);
  if ((response as any).error && (response as any).error.status === 400) {
    console.log("create account");
  }
  console.log("token:", jwtDecode<GoogleClaims>(token));
}
