import { apiSlice } from "../../app/api/apiSlice"
import { logOut, setCredentials } from "./authSlice"

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({    //credentials usually username and pwd
                url: "/auth",
                method: "POST",
                body: {...credentials}
            })
        }),
        sendLogout: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST"
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {   //RTK provides an onQueryStarted function that we can call inside our endpoint
                //it accepts an argument (not defined here, but needs to be there). Also provides dispatch and queryFulfilled so we can verify query is fulfilled
                try {
                    //following is commented out, but can set const { data } = await queryFulfilled, it returns a data property.
                    //const { data } = 
                    await queryFulfilled
                    //if we log the data, it will be the message from the rest api we created that says "cookie cleared"
                    //console.log(data)
                    dispatch(logOut())
                    setTimeout(() => {  //fix for useQuery when it doesn't unsibscribe
                        dispatch(apiSlice.util.resetApiState()) //this is called to clear our the cache
                    }, 1000)
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    console.log(data)   //data is the access token
                    const { accessToken } = data    //accessToken destructured here
                    dispatch(setCredentials({ accessToken }))
                } catch (err) {
                    console.log(err)
                }
            }
        })
    })
})

export const {
    useLoginMutation,
    useSendLogoutMutation, //exported to DashHeader.jsx
    useRefreshMutation      //exported to PersistLogin.jsx
} = authApiSlice