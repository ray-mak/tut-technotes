import { configureStore } from "@reduxjs/toolkit"
import { apiSlice } from "./api/apiSlice"

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: getDefaultMiddleware => 
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})

// reducer will refer to that apiSlice. Also providing middleware