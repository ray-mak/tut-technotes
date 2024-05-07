//allows us to stay logged in even when refreshing application
import { Outlet, Link } from "react-router-dom"
import { useEffect, useRef, useState } from 'react'
import { useRefreshMutation } from "./authApiSlice"
import usePersist from "../../hooks/usePersist"
import { useSelector } from 'react-redux'
import { selectCurrentToken } from "./authSlice"


const PersistLogin = () => {
    const [persist] = usePersist()
    const token = useSelector(selectCurrentToken)
    const effectRan = useRef(false)

    const [trueSuccess, setTrueSuccess] = useState(false)

    const [refresh, {
        isUninitialized,    //means refresh function has not been called yet
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation()

    //handling React 18 strict mode
    useEffect(() => {
        //first time useEffect runs, it will be false. But useEffect runs twice in Strict Mode in development. It will be true the second time, but only becuase we set it to true later on.
        //This can cause a problem if we're using the refresh token, so we only want to sent it one time
        if (effectRan.current === true || process.env.NODE_ENV !== 'development') { // React 18 Strict Mode

            const verifyRefreshToken = async () => {
                console.log('verifying refresh token')
                try {
                    //const response = 
                    await refresh()
                    //const { accessToken } = response.data
                    //Can have isSuccess before credentials get set. setTrueSuccess is here to give it a little more time
                    setTrueSuccess(true)
                }
                catch (err) {
                    console.error(err)
                }
            }

            if (!token && persist) verifyRefreshToken()
        }

        //cleanup function. After useEffect runs the first time, cleanup function sets effectRan.current to true. useRef will hold that value even after component unmounts and remounts
        return () => effectRan.current = true

        // eslint-disable-next-line
    }, [])

    let content
    if (!persist) { // persist: no
        console.log('no persist')
        content = <Outlet />
    } else if (isLoading) { //persist: yes, token: no
        console.log('loading')
        content = <p>Loading...</p>
    } else if (isError) { //persist: yes, token: no , can happen when our refresh token expires
        console.log('error')
        content = (
            <p className='errmsg'>
                {`${error?.data?.message} - `}
                <Link to="/login">Please login again</Link>.
            </p>
        )
    } else if (isSuccess && trueSuccess) { //persist: yes, token: yes, 
        console.log('success')
        content = <Outlet />
    } else if (token && isUninitialized) { //persist: yes, token: yes
        console.log('token and uninit')
        console.log(isUninitialized)
        content = <Outlet />
    }

    return content

}

export default PersistLogin