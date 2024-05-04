import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice"

const usersAdapter = createEntityAdapter({})

const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({ //use the apiSlice that we import, and inject endpoints
    endpoints: builder => ({    //define endpoints
        getUsers: builder.query({   //getUsers query
            query: () => '/users', //the query is going to the 'users' endpoint. (basequery url already provided in apiSlice)
            validateStatus: (response, result) => { 
                return response.status === 200 && !result.isError //make sure we have 200 status and there is not an error
            },
            transformResponse: responseData => { //important since we're working with MongoDB
                const loadedUsers = responseData.map(user => {
                    user.id = user._id
                    return user
                })
                return usersAdapter.setAll(initialState, loadedUsers) //use setAll and provide loadedUsers,
                //which is the responseData with the updated id values. Stored in our usersAdapter as normalized data
            },
            providesTags: (result, error, arg) => { //provides tags that can be invalidated
                //could possibly get results that doesn't have id's. This is how it is handled
                if (result?.ids) {
                    return [
                        { type: 'User', id: 'LIST'},
                        ...result.ids.map(id => ({ type: 'User', id }))
                    ]
                } else return [{type: 'User', id: 'LIST'}]
            }
        }),
        addNewUser: builder.mutation({ //mutation is used for defining endpoints that modify data on the server
            query: inititalUserData =>( {
                url: '/users',
                method: 'POST',
                body: {
                    ...inititalUserData
                }
            }),
            invalidatesTags: [  //forces cache in RTK query to update
                {type: "User", id: "LIST"} //user list will be invalidated, which means the corresponding cached data should be refetched the next time it is accessed.
            ]
        }),
        updateUser: builder.mutation({
            query: inititalUserData => ({
                url: "/users",
                method: "PATCH",
                body: {
                    ...inititalUserData
                }
            }),
            invalidatesTags: (result, error, arg) => [ //invalidating tags, but not the list
                { type: "User", id: arg.id} // We can specify the id of the user we are passing in with the arg parameter
            ]
        }),
        deleteUser: builder.mutation({
            query: ({ id }) => ({
                url: "/users",
                method: "DELETE",
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "User", id: arg.id}
            ]
        })
    })
})
//RTK query will create a hook based on the above endpoint automatically, so we export that hook
export const {
    useGetUsersQuery,
    useAddNewUserMutation,  //exported to NewUserForm.jsx
    useUpdateUserMutation,  //exported to EditUserForm.jsx
    useDeleteUserMutation   //exported to EditUserForm.jsx
} = usersApiSlice

//create selectors

//returns the query result object 
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select() //refer to endpoints in usersApiSlice, calling getUsers, then chain select method

//creates memoized selector
const selectUsersData = createSelector( //user createSelector which was imported above
    selectUsersResult,  //pass in selectUsersResult
    usersResult => usersResult.data //normalized state object with ids and entities.
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllUsers,
    selectById: selectUserById, //exported to EditUser.jsx
    selecIds: selectUserIds
    //pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)