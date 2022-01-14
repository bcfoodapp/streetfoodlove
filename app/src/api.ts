import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { RootState } from "./store";
import { DateTime } from "luxon";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
}

// Contains user fields that are password-protected.
export interface UserProtected extends User {
  Email: string;
  FirstName: string;
  LastName: string;
}

export interface Review {
  ID: string;
  DatePosted: DateTime;
  Text: string;
  VendorID: string;
  UserID: string;
  Stars: 1 | 2 | 3 | 4 | 5;
}

type RawReview = Review & { DatePosted: string };

export interface Credentials {
  Username: string;
  Password: string;
}

export interface GeoRectangle {
  northWestLat: number;
  northWestLng: number;
  southEastLat: number;
  southEastLng: number;
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

const encode = encodeURIComponent;

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8080",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).token.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// API doc: https://app.swaggerhub.com/apis-docs/foodapp/FoodApp/0.0.1
export const apiSlice = createApi({
  baseQuery: async (args, api, extraOptions) => {
    // Renew token if it expired (10 minute expiration time)
    if (
      args &&
      (api.getState() as RootState).token.tokenTime <=
        DateTime.now().minus({ minutes: 10 }).toSeconds()
    ) {
      const credentials = getCredentials();
      if (credentials !== null) {
        let response = await baseQuery(
          { url: "/token", method: "POST", body: credentials },
          api,
          extraOptions
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
      }
    }

    return baseQuery(args, api, extraOptions);
  },
  tagTypes: ["Review", "LoggedInUser"],
  endpoints: (builder) => ({
    vendor: builder.query<Vendor, string>({
      query: (id) => `/vendors/${encode(id)}`,
    }),
    user: builder.query<User, string>({
      query: (id) => `/users/${encode(id)}`,
    }),
    userProtected: builder.query<UserProtected, string>({
      query: (id) => `/users/${encode(id)}/protected`,
    }),
    updateUser: builder.mutation<undefined, UserProtected>({
      query: (user) => ({
        url: `/users/${encode(user.ID)}/protected`,
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["LoggedInUser"],
    }),
    createUser: builder.mutation<
      undefined,
      UserProtected & { Password: string }
    >({
      query: (payload) => ({
        url: `/users/${encode(payload.ID)}/protected`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["LoggedInUser"],
    }),
    // Changes password for given user.
    updatePassword: builder.mutation<
      undefined,
      { userID: string; password: string }
    >({
      query: ({ userID, password }) => ({
        url: `/users/${encode(userID)}/password`,
        method: "POST",
        body: password,
      }),
    }),
    reviews: builder.query<Review[], string>({
      query: (vendorID) => `/reviews?vendorID=${encode(vendorID)}`,
      transformResponse: (response) =>
        (response as RawReview[]).map((review) => ({
          ...review,
          PostDate: DateTime.fromISO(review.DatePosted),
        })),
      providesTags: ["Review"],
    }),
    submitReview: builder.mutation<undefined, Review>({
      query: (review) => ({
        url: `/reviews/${encode(review.ID)}`,
        method: "PUT",
        body: review,
      }),
      invalidatesTags: ["Review"],
    }),
    setCredentialsAndGetToken: builder.mutation<undefined, Credentials>({
      queryFn: async (args, api, extraOptions) => {
        let response = await baseQuery(
          { url: "/token", method: "POST", body: args },
          api,
          extraOptions
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

        setCredentialsState(args);

        return { data: undefined };
      },
    }),
    // Returns list of vendor IDs inside given rectangle.
    mapViewVendors: builder.query<string[], GeoRectangle>({
      query: (rectangle) => ({
        url: `/map/view/${rectangle.northWestLat}/${rectangle.northWestLng}/${rectangle.southEastLat}/${rectangle.southEastLng}`,
      }),
    }),
  }),
});

function setCredentialsState(credentials: Credentials) {
  console.info("set localStorage");
  localStorage.setItem("user", JSON.stringify(credentials));
}

function getCredentials(): Credentials | null {
  const entry = localStorage.getItem("user");
  if (entry === null) {
    return null;
  }

  return JSON.parse(entry);
}

export const {
  useVendorQuery,
  useUserQuery,
  useUserProtectedQuery,
  useUpdateUserMutation,
  useCreateUserMutation,
  useUpdatePasswordMutation,
  useReviewsQuery,
  useSubmitReviewMutation,
  useSetCredentialsAndGetTokenMutation,
  useMapViewVendorsQuery,
} = apiSlice;
