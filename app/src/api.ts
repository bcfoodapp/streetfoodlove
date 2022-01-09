import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { RootState } from "./store";

export interface Vendor {
  ID: string;
  Name: string;
  BusinessAddress: string;
  Website: string;
  BusinessHours: string;
  Phone: string;
  BusinessLogo: string;
  Latitude: string;
  Longitude: string;
}

export interface User {
  ID: string;
  Username: string;
  Photo: string;
  UserType: "customer" | "vendor";
}

// Contains user fields that are password-protected.
export interface UserProtected extends User {
  Email: string;
  FirstName: string;
  LastName: string;
}

export interface Review {
  ID: string;
  Text: string;
  VendorID: string;
  UserID: string;
}

export interface Credentials {
  Username: string;
  Password: string;
}

export type Token = string;

const encode = encodeURIComponent;

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).root.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
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
    createUser: builder.mutation<undefined, UserProtected>({
      query: (user) => ({
        url: `/users/${encode(user.ID)}/protected`,
        method: "PUT",
        body: user,
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
    newToken: builder.mutation<Token, Credentials>({
      query: (credentials) => ({
        url: "/token",
        method: "POST",
        body: credentials,
      }),
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
  useNewTokenMutation,
} = apiSlice;
