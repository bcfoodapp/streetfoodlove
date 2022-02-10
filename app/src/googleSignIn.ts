import jwtDecode from "jwt-decode";
import {
  useCreateUserMutation,
  useGetTokenWithGoogleMutation,
  UserType,
} from "./api";
import { v4 as uuid } from "uuid";
import { DateTime } from "luxon";
import { QueryReturnValue } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query/react";

// https://developers.google.com/identity/gsi/web/reference/js-reference#credential
interface GoogleClaims {
  family_name: string;
  given_name: string;
  email: string;
  // Google ID
  sub: string;
}

// Logs in with Google account, creating an account if necessary. The passed token is the one provided by Google using
// OAuth. On success, token in store is set.
export async function signInWithGoogle(
  token: string,
  getTokenWithGoogle: ReturnType<typeof useGetTokenWithGoogleMutation>[0],
  createUser: ReturnType<typeof useCreateUserMutation>[0]
): Promise<QueryReturnValue<string, FetchBaseQueryError, {}>> {
  const response = await getTokenWithGoogle(token);
  if ((response as any).error && (response as any).error.status === 400) {
    const tokenPayload = jwtDecode<GoogleClaims>(token);
    const createUserResponse = await createUser({
      ID: uuid(),
      Username: tokenPayload.given_name,
      Photo: uuid(),
      UserType: UserType.Customer,
      Email: tokenPayload.email,
      FirstName: tokenPayload.given_name,
      LastName: tokenPayload.family_name,
      Password: uuid(),
      SignUpDate: DateTime.now(),
      GoogleID: tokenPayload.sub,
    });
    if ((createUserResponse as any).error !== undefined) {
      return createUserResponse as QueryReturnValue<
        string,
        FetchBaseQueryError,
        {}
      >;
    }

    return (await getTokenWithGoogle(token)) as QueryReturnValue<
      string,
      FetchBaseQueryError,
      {}
    >;
  }
  return response as QueryReturnValue<string, FetchBaseQueryError, {}>;
}
