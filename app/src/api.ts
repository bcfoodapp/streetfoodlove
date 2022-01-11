import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { RootState } from "./store";
import { DateTime } from "luxon";

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

export type Token = string;

const encode = encodeURIComponent;

export const apiSlice = createApi({
  baseQuery: async (args, api, extraOptions) => {
    return fetchBaseQuery({
      baseUrl: "http://localhost:8080",
      prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).root.token;
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
      },
    })(args, api, extraOptions);
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
    getTokenAndSetState: builder.mutation<undefined, Credentials>({
      queryFn: async (args, api, extraOptions) => {
        let response = await fetch("http://localhost:8080/token", {
          method: "POST",
          body: JSON.stringify(args),
        });
        if (!response.ok) {
          return { error: await response.json() };
        }

        api.dispatch({ type: "root/setToken", payload: await response.json() });

        return { data: undefined };
      },
    }),
  }),
});

export const {
  useVendorQuery,
  useUserQuery,
  useUserProtectedQuery,
  useUpdateUserMutation,
  useCreateUserMutation,
  useUpdatePasswordMutation,
  useReviewsQuery,
  useSubmitReviewMutation,
  useGetTokenAndSetStateMutation,
} = apiSlice;
