import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    baseQuery : fetchBaseQuery({ baseUrl: 'http://localhost:3500/'}),   //will need to change when deployed on actual site
    tagTypes: ['Note,', 'User'],
    endpoints: builder => ({})
})

//provided endpoints with empty builder. Will attach extended slices that will attach to this ApiSlice for notes and users
