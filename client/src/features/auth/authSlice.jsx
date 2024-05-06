import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: "auth",
    initialState: { token: null },
    reducers: {
        setCredentials: (state, action) => { //after we get data back from the api, we are going to have a payload
            const { accessToken } = action.payload //the payload is going to contain the accessToken
            state.token = accessToken   //we set the state.token to accessToken
        },
        logOut: (state, action) => {
            state.token = null
        }
    }
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state) => state.auth.token