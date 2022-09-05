import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useSession, SessionActionType } from "../../components/Session"

export const useRedirectHereAfterLogin = () => {
    const [{token, redirect}, dispatch] = useSession()
    const location = useLocation()

    useEffect(() => {
        if(!token) {
            dispatch({
                type: SessionActionType.SET_REDIRECT,
                payload: location.pathname
            })
            localStorage.setItem('redirect', location.pathname)
        } else if(redirect === location.pathname){
            dispatch({
                type: SessionActionType.SET_REDIRECT,
                payload: null
            })
            localStorage.removeItem('redirect')
        }
    }, [token])
}