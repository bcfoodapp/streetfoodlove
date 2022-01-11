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
  Latitude: number;
  Longitude: number;
}

export interface User {
  ID: string;
  Email: string;
  Username: string;
  FirstName: string;
  LastName: string;
  UserType: number;
  Photo: string;
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
  tagTypes: ["Review"],
  endpoints: (builder) => ({
    vendor: builder.query<Vendor, string>({
      query: (id) => `/vendors/${encode(id)}`,
    }),
    user: builder.query<User, string>({
      query: (id) => `/users/${encode(id)}`,
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
  useReviewsQuery,
  useSubmitReviewMutation,
  useNewTokenMutation,
} = apiSlice;
