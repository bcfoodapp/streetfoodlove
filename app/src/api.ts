import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/dist/query/react";
import { RootState } from "./store";
import { DateTime } from "luxon";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  BaseQueryApi,
  QueryReturnValue,
} from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import jwtDecode from "jwt-decode";
import config from "./configuration.json";
import { v4 as uuid } from "uuid";

export interface Vendor {
  ID: string;
  Name: string;
  BusinessAddress: string;
  Website: string;
  BusinessHours: string;
  Phone: string;
  BusinessLogo: string;
  Latitude: number;
  Longitude: number;
  Owner: string;
}

export enum UserType {
  Customer,
  Vendor,
}

export interface User {
  ID: string;
  Username: string;
  Photo: string;
  UserType: UserType;
  FirstName: string;
  LastName: string;
}

// Contains user fields that are password-protected.
export interface UserProtected extends User {
  Email: string;
  SignUpDate: DateTime;
  GoogleID: string | null;
}

export type StarRatingInteger = 1 | 2 | 3 | 4 | 5 | null;

export interface Review {
  ID: string;
  DatePosted: DateTime;
  Text: string;
  VendorID: string;
  UserID: string;
  StarRating: StarRatingInteger;
  // Contains the ID of the parent review, or null if there is no parent.
  ReplyTo: string | null;
}

export interface Credentials {
  Username: string;
  Password: string;
}

export interface CredentialsAndName extends Credentials {
  Name: string;
}

export interface GeoRectangle {
  northWestLat: number;
  northWestLng: number;
  southEastLat: number;
  southEastLng: number;
}

export interface Guide {
  ID: string;
  Guide: string;
  DatePosted: DateTime;
  ArticleAuthor: string;
}

// Payload of Google token.
// https://developers.google.com/identity/gsi/web/reference/js-reference#credential
interface GoogleClaims {
  family_name: string;
  given_name: string;
  email: string;
  // Google ID
  sub: string;
}

export const tokenSlice = createSlice({
  name: "token",
  initialState: {
    token: null as string | null,
    // Unix timestamp when the token was created.
    tokenTime: 0,
  },
  reducers: {
    setTokenAndTime: (
      state,
      {
        payload: { token, time },
      }: PayloadAction<{ token: string; time: number }>
    ) => {
      state.token = token;
      state.tokenTime = time;
    },
  },
});

const { setTokenAndTime } = tokenSlice.actions;

// Returns userID inside token.
export function getUserIDFromToken(token: string) {
  return jwtDecode<{ UserID: string }>(token).UserID;
}

const PUT = "PUT";
const POST = "POST";

const encode = encodeURIComponent;

const baseQuery = fetchBaseQuery({
  baseUrl: config.apiBaseURL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).token.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Gets token and saves it to localStorage if successful. Returns response.
async function getAndSaveCredentials(
  credentials: Credentials,
  api: BaseQueryApi
): Promise<QueryReturnValue<string, FetchBaseQueryError, {}>> {
  const response = await baseQuery(
    { url: "/token", method: POST, body: credentials },
    api,
    {}
  );
  if (response.error) {
    return response;
  }

  api.dispatch(
    setTokenAndTime({
      token: response.data as string,
      time: DateTime.now().toSeconds(),
    })
  );
  return response as QueryReturnValue<string, FetchBaseQueryError, {}>;
}

// This is the API abstraction.
// API doc: https://app.swaggerhub.com/apis-docs/foodapp/FoodApp/0.0.1
export const apiSlice = createApi({
  baseQuery: async (args, api, extraOptions) => {
    // Renew token if it expired (10 minute expiration time)
    if (
      args &&
      (api.getState() as RootState).token.tokenTime <=
        DateTime.now().minus({ minutes: 10 }).toSeconds()
    ) {
      const credentials = getCredentialsAndName();
      if (credentials !== null) {
        const response = await getAndSaveCredentials(credentials, api);
        if (response.error) {
          return response;
        }
      }
    }

    return baseQuery(args, api, extraOptions);
  },
  tagTypes: ["Review"],
  endpoints: (builder) => ({
    version: builder.query<string, void>({
      query: () => `/version`,
    }),
    vendor: builder.query<Vendor, string>({
      query: (id) => `/vendors/${encode(id)}`,
    }),
    // Gets all vendors that match the given IDs
    vendorsMultiple: builder.query<Vendor[], string[]>({
      queryFn: async (args, api, extraOptions) => {
        const vendors = [] as Vendor[];
        for (const id of args) {
          const response = await baseQuery(
            `/vendors/${encode(id)}`,
            api,
            extraOptions
          );
          if (response.error) {
            return response;
          }

          vendors.push(response.data as Vendor);
        }
        return { data: vendors };
      },
    }),
    // Returns vendors with given owner ID. There should only be zero or one vendor associated with a user.
    vendorByOwnerID: builder.query<Vendor[], string>({
      query: (ownerID) => `/vendors?owner=${encode(ownerID)}`,
    }),
    createVendor: builder.mutation<undefined, Vendor>({
      query: (vendor) => ({
        url: `/vendors/${encode(vendor.ID)}`,
        method: PUT,
        body: vendor,
      }),
    }),
    updateVendor: builder.mutation<undefined, Vendor>({
      query: (vendor) => ({
        url: `/vendors/${encode(vendor.ID)}`,
        method: POST,
        body: vendor,
      }),
    }),
    user: builder.query<User, string>({
      query: (id) => `/users/${encode(id)}`,
    }),
    usersMultiple: builder.query<Record<string, User>, string[]>({
      queryFn: async (args, api, extraOptions) => {
        const users = {} as Record<string, User>;
        for (const id of args) {
          const response = await baseQuery(
            `/users/${encode(id)}`,
            api,
            extraOptions
          );
          if (response.error) {
            return response;
          }

          const data = response.data as User;
          users[data.ID] = data;
        }
        return { data: users };
      },
    }),
    userProtected: builder.query<UserProtected, string>({
      query: (id) => `/users/${encode(id)}/protected`,
      transformResponse: (user: any) => ({
        ...user,
        SignUpDate: DateTime.fromISO(user.SignUpDate),
      }),
    }),
    updateUser: builder.mutation<undefined, UserProtected>({
      query: (user) => ({
        url: `/users/${encode(user.ID)}/protected`,
        method: POST,
        body: user,
      }),
    }),
    createUser: builder.mutation<
      undefined,
      UserProtected & { Password: string }
    >({
      query: (payload) => ({
        url: `/users/${encode(payload.ID)}/protected`,
        method: PUT,
        body: payload,
      }),
    }),
    // Changes password for given user.
    updatePassword: builder.mutation<
      undefined,
      { userID: string; password: string }
    >({
      query: ({ userID, password }) => ({
        url: `/users/${encode(userID)}/password`,
        method: POST,
        body: password,
      }),
    }),
    reviews: builder.query<Review[], string>({
      query: (vendorID) => `/reviews?vendorID=${encode(vendorID)}`,
      transformResponse: (response: any[]) =>
        response.map((review) => ({
          ...review,
          PostDate: DateTime.fromISO(review.DatePosted),
        })),
      providesTags: ["Review"],
    }),
    submitReview: builder.mutation<undefined, Review>({
      query: (review) => ({
        url: `/reviews/${encode(review.ID)}`,
        method: PUT,
        body: review,
      }),
      invalidatesTags: ["Review"],
    }),
    // Gets token using stored credentials and saves it to state.
    // This endpoint should be used to get the token if no query is called before the token is required. When any query
    // is called, the token can be retrieved from the store without calling getToken.
    getToken: builder.mutation<undefined, void>({
      queryFn: async (arg, api, extraOptions) => {
        const credentials = getCredentialsAndName();
        if (credentials !== null) {
          await getAndSaveCredentials(credentials, api);
        }
        return { data: undefined };
      },
    }),
    // Retrieves token and stores credentials and name in localStorage.
    setCredentialsAndGetToken: builder.mutation<undefined, Credentials>({
      queryFn: async (args, api, extraOptions) => {
        const credentialsResponse = await getAndSaveCredentials(args, api);
        if (credentialsResponse.error) {
          return credentialsResponse;
        }

        // Get name of user
        const userID = getUserIDFromToken(credentialsResponse.data as string);
        const userResponse = await baseQuery(
          `/users/${encode(userID)}`,
          api,
          extraOptions
        );
        if (userResponse.error) {
          return userResponse;
        }
        const user = userResponse.data as User;

        setCredentialsAndName({
          ...args,
          Name: `${user.FirstName} ${user.LastName}`,
        });
        return { data: undefined };
      },
    }),
    // Returns list of vendor IDs inside given rectangle.
    mapViewVendors: builder.query<string[], GeoRectangle>({
      query: (rectangle) => ({
        url: `/map/view/${rectangle.northWestLat}/${rectangle.northWestLng}/${rectangle.southEastLat}/${rectangle.southEastLng}`,
      }),
    }),
    guide: builder.query<Guide, string>({
      query: (id) => ({
        url: `/guides/${id}`,
      }),
      transformResponse: (guide: any) => ({
        ...guide,
        DatePosted: DateTime.fromISO(guide.DatePosted),
      }),
    }),
    // Signs in with Google account, creating an account if necessary. The passed token is the one provided by Google
    // using OAuth. On success, token in store is set.
    signInWithGoogle: builder.mutation<string, string>({
      queryFn: async (arg, api, extraOptions) => {
        const body = {
          GoogleToken: arg,
        };
        let response = await baseQuery(
          { url: "/token/google", method: POST, body },
          api,
          {}
        );
        if (response.error && response.error.status === 400) {
          // Account does not exist so we need to make one
          const tokenPayload = jwtDecode<GoogleClaims>(arg);
          const newUser: UserProtected & { Password: string } = {
            ID: uuid(),
            Username: tokenPayload.given_name + tokenPayload.family_name,
            Photo: uuid(),
            UserType: UserType.Customer,
            Email: tokenPayload.email,
            FirstName: tokenPayload.given_name,
            LastName: tokenPayload.family_name,
            Password: uuid(),
            SignUpDate: DateTime.now(),
            GoogleID: tokenPayload.sub,
          };
          const createUserResponse = await baseQuery(
            {
              url: `/users/${encode(newUser.ID)}/protected`,
              method: PUT,
              body: newUser,
            },
            api,
            {}
          );
          if (createUserResponse.error) {
            return createUserResponse;
          }

          response = await baseQuery(
            { url: "/token/google", method: POST, body },
            api,
            {}
          );
          if (response.error) {
            return response;
          }
        }

        const token = response.data as string;

        api.dispatch(
          setTokenAndTime({
            token,
            time: DateTime.now().toSeconds(),
          })
        );

        return { data: token };
      },
    }),
  }),
});

export const {
  useVersionQuery,
  useVendorQuery,
  useVendorsMultipleQuery,
  useVendorByOwnerIDQuery,
  useCreateVendorMutation,
  useUpdateVendorMutation,
  useUserQuery,
  useLazyUsersMultipleQuery,
  useUserProtectedQuery,
  useUpdateUserMutation,
  useCreateUserMutation,
  useUpdatePasswordMutation,
  useReviewsQuery,
  useSubmitReviewMutation,
  useGetTokenMutation,
  useSetCredentialsAndGetTokenMutation,
  useMapViewVendorsQuery,
  useGuideQuery,
  useSignInWithGoogleMutation,
} = apiSlice;

// Sets credentials and name in localStorage.
function setCredentialsAndName(entry: CredentialsAndName) {
  console.info("set localStorage");
  localStorage.setItem("user", JSON.stringify(entry));
}

// Gets credentials from localStorage.
export function getCredentialsAndName(): CredentialsAndName | null {
  const entry = localStorage.getItem("user");
  if (entry === null) {
    return null;
  }

  return JSON.parse(entry);
}

// Clears all entries in localStorage.
export function clearLocalStorage() {
  console.info("clear localStorage");
  localStorage.clear();
}
