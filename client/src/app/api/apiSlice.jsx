import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import setCredentials from "../../features/auth/authSlice"

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3500',    //will need to change when deployed on actual site 
    credentials: 'include',             //this way, we'll always send our cookie
    prepareHeaders: (headers, { getState }) => {    //this is a specific function to fetchBaseQuery. First parameter is headers
        //Also has an api object that we can destructure (getState), allows us to get current state of application
        const token = getState().auth.token     //call getState, look at auth state, and get current token

        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers  //this is applied to every request we send
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {    //accepts args, which essentially what we're passing into fetchBaseQuery like url. Also has it's own api. Pass these all in even if not using
    // console.log(args) // request url, method, body
    // console.log(api) // signal, dispatch, getState()
    // console.log(extraOptions) //custom like {shout: true}

    let result = await baseQuery(args, api, extraOptions)   //result from our first request. We use the access token defined above

    // If you want, handle other status codes, too
    if (result?.error?.status === 403) {
        console.log('sending refresh token')

        // send refresh token to get new access token 
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

        if (refreshResult?.data) {  //what we expect to get is data. data should hold the access token

            // store the new token 
            api.dispatch(setCredentials({ ...refreshResult.data }))

            // retry original query with new access token
            result = await baseQuery(args, api, extraOptions)
        } else {

            if (refreshResult?.error?.status === 403) { ////so if we have 2 403's in a row
                refreshResult.error.data.message = "Your login has expired."
            }
            return refreshResult
        }
    }

    return result
}


export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,   //(baseQuery now defined above)
    tagTypes: ['Note,', 'User'],
    endpoints: builder => ({})
})

//fetchBaseQuery is where our server is
//provided endpoints with empty builder. Will attach extended slices that will attach to this ApiSlice for notes and users
