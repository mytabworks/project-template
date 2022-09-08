import { useEffect } from "react"
import { SessionActionType, useSession } from "../../components/Session"
import { useAuthAPI } from "./useAuthAPI"

export const useReceiveUser = () => {
    const [{initial, token, received_once}, dispatch] = useSession()
    const requestUser = useAuthAPI('/api/Me', { method: 'GET' })

    useEffect(() => {
        if(!initial) {
            if(token) {
                if(!received_once) {
                    dispatch({ 
                        type: SessionActionType.SETTING_USER,
                        payload: true
                    })
                    requestUser.call().then(async response => {
                        const payload: any = response.data || null
                        
                        dispatch({ 
                            type: SessionActionType.SET_USER,
                            payload
                        })
                        
                    })
                    .catch(() => {
                        dispatch({ 
                            type: SessionActionType.SET_TOKEN,
                            payload: null
                        })
                    })
                }
            } else {
                dispatch({ 
                    type: SessionActionType.SET_USER,
                    payload: null
                })
            }
        }
    }, [token, initial])
}