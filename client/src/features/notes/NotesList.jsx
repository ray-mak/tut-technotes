import { useGetNotesQuery } from "./notesApiSlice"
import Note from "./Note"
import useAuth from "../../hooks/useAuth"

export default function NotesList() {
    const { username, isManager, isAdmin } = useAuth()
    const {
        data: notes,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetNotesQuery("notesList", {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {
        const { ids, entities } = notes

        let filteredIds
        if (isManager || isAdmin) {
            filteredIds = [...ids]
        } else {    //if not a manager or admin, ids array filtered, where noteId, (each id passed in) is going to be used on the entity, to identify the entity and see if it matches that username.
            filteredIds = ids.filter(noteId => entities[noteId].username === username) //means non-admin or manager can only see notes assigned to himself
        }

        const tableContent = ids?.length && filteredIds.map(noteId => <Note key={noteId} noteId={noteId} />)

        content = (
            <table className="table table--notes">
                <thead className="table__thead">
                    <tr>
                        <th scope="col" className="table__th note__status">Username</th>
                        <th scope="col" className="table__th note__created">Created</th>
                        <th scope="col" className="table__th note__updated">Updated</th>
                        <th scope="col" className="table__th note__title">Title</th>
                        <th scope="col" className="table__th note__username">Owner</th>
                        <th scope="col" className="table__th note__edit">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }

    return content
}