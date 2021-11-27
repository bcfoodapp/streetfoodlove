import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export interface Vendor {
  ID: string;
  BusinessAddress: string;
  Name: string;
  Phone: string;
}

const encode = encodeURIComponent;

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080" }),
  endpoints: (builder) => ({
    getVendor: builder.query<Vendor, string>({
      query: (id) => `/vendors/${encode(id)}`,
    }),
  }),
});

export const { useGetVendorQuery } = apiSlice;
