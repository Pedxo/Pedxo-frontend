import { useEffect } from "react"
import { useState } from "react"
import { Outlet } from "react-router-dom"
import { RefreshToken } from "../hooks/refreshToken"
import { useAuth } from "../hooks/auth"

export const PersistLogin = () => {
    const [mounted, setMounted] = useState(true)
    const refresh = RefreshToken();
    const { data, persist } = useAuth();

    useEffect(() => {

        const verifyToken = async () => {
            try {
                await refresh();
            } 
            catch (err) {
                console.error(err)
            }
            finally{
                setMounted(false)
            }
        }

        !data?.accessToken && persist ? verifyToken() : setMounted(false)

        return verifyToken
    }, [data, persist, refresh, mounted])

    return (
        <>
            {!persist
                ? <Outlet />
                : <Outlet />
            }
        </>
    )
}