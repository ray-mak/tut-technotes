import { useParams } from "react-router-dom"    //going to get userId parameter from URL
import { useSelector } from "react-redux"
import { selectUserById } from "../users/usersApiSlice"
import EditUserForm from "./EditUserForm"

//not bringing in a query, going to pull user data from state, going to do that by selecting user id

const EditUser = () => {
    const { id } = useParams()  //useParams hook returns an object of key/value pairs from the current URL that were matched by <Route path>
    
    const user = useSelector(state => selectUserById(state, id))

    const content = user ? <EditUserForm user={user} /> : <p>Loading...</p>

    return content
}

export default EditUser