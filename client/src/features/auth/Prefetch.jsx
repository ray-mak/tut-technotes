import { store } from '../../app/store'
import { notesApiSlice } from '../notes/notesApiSlice'
import { usersApiSlice } from '../users/usersApiSlice'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const Prefetch = () => {
    useEffect(() => {
        console.log('subscribing')
        const notes = store.dispatch(notesApiSlice.endpoints.getNotes.initiate()) //create manual subscribtion to notes and users
        const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate()) //use the slice, call the endpoints, call the query, initiate method creates the manual subscription

        return () => {      //will unsubscribe when we leave the protected pages.
            console.log('unsubscribing')
            notes.unsubscribe()
            users.unsubscribe()
        }
    }, []) //empty dependency array, only want it to run when this component mounts

    return <Outlet />   //returns an Outlet. Will wrap our protected pages in this Prefetch component. Will allow us to maintain state even when refreshing page
}

export default Prefetch