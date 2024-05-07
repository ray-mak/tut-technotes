import { useState, useEffect } from "react"

const usePersist = () => {
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false) // if persist does not exist in our localstorage, it is set to false

    useEffect(() => {   //when persist changes, we set that value to the localstorage
        localStorage.setItem("persist", JSON.stringify(persist))
    }, [persist])

    return [persist, setPersist]
}
export default usePersist

//exported to Login and PersistLogin