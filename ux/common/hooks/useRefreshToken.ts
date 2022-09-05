import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import branding from "@config/branding"
import { useAuthAPI } from "./useAuthAPI"
import cookie from "../utils/cookie"
import { SessionActionType, useSession } from "../../components/Session"
import { useEffectMounted } from "./useEffectMounted"

export const useRefreshToken = () => {
    const location = useLocation()
    const [{initial, token}, dispatch] = useSession()
    const requestToken = useAuthAPI("/api/RefreshToken")
    
    useEffectMounted(() => {
        if(!initial && !!token && !(location.pathname.includes('/auth') || location.pathname.includes('/logout'))) {
            requestToken.call().then(response => {
                if(response.data.success) {
                    const token = response.data.token
                    cookie.set(branding.token.name, token, { expireday: branding.token.expireday, domain: branding.token.domain })
                    localStorage.setItem('expireTimestamp', Date.now().toString())
                    
                    dispatch({
                        type: SessionActionType.SET_TOKEN,
                        payload: token,
                    });
                }
            })
        }
    }, [location.pathname])
}