import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

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
  Email: string;
  Username: string;
  FirstName: string;
  LastName: string;
  SignUpDate: string;
  UserType: number;
  Photo: string;
}

export interface Review {
  ID: string;
  Text: string;
  VendorID: string;
  UserID: string;
  DatePosted: string;
}

const encode = encodeURIComponent;

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080" }),
  tagTypes: ['Review'],
  endpoints: (builder) => ({
    vendor: builder.query<Vendor, string>({
      query: (id) => `/vendors/${encode(id)}`,
    }),
    user: builder.query<User, string>({
      query: (id) => `/users/${encode(id)}`,
    }),
    reviews: builder.query<Review[], string>({
      query: (vendorID) => `/reviews?vendorID=${encode(vendorID)}`,
    }),
    submitReview: builder.mutation<undefined, Review>({
      query: (review) => ({
        url: `/reviews/${encode(review.ID)}`,
        method: 'PUT',
        body: review,
      }),
    }),
  }),
});

export const {
  useVendorQuery,
  useUserQuery,
  useReviewsQuery,
  useSubmitReviewMutation,
} = apiSlice;
