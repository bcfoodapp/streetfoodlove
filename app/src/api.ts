import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import {RootState} from './store';

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

export interface Credentials {
  Username: string;
  Password: string;
}

export type Token = string;

const encode = encodeURIComponent;

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080",
    prepareHeaders: (headers, {getState}) => {
      const token = (getState() as RootState).root.token;
      if (token !== null) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
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
    newToken: builder.mutation<Token, Credentials>({
      query: (credentials) => ({
        url: '/token',
        method: 'POST',
        body: credentials,
      }),
    })
  }),
});

export const {
  useVendorQuery,
  useUserQuery,
  useReviewsQuery,
  useSubmitReviewMutation,
  useNewTokenMutation,
} = apiSlice;
