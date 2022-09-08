import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { SessionActionType, useSession } from '../../components/Session'
import cookie from '../utils/cookie'
import branding from '@config/branding'
import { useRefreshToken } from './useRefreshToken'

export const useLinearToken = () => {
    const [{token, initial, others}, dispatch] = useSession()
    const history = useHistory()
    // get token from cookie when the app is hard refreshed
    useEffect(() => {
        if(initial) {
            const token = cookie.get(branding.token.name)
            dispatch({
                type: SessionActionType.SET_TOKEN,
                payload: token || null
            })

            if(branding.allowOrganisationSelection) {
                const organisationID = localStorage.getItem('selected-organisation')
                dispatch({
                    type: SessionActionType.SET_OTHERS,
                    payload: {
                        ...others,
                        organisationID: organisationID ? parseInt(organisationID) : null,
                        hasSelectedOrganisation: !!organisationID
                    }
                })
            }
        }
    // eslint-disable-next-line
    }, [])

    // check if token timestamp is expired and kick you out.
    useEffect(() => {
        if(token) {
            const localExpTime = localStorage.getItem('expireTimestamp')
            const expireTimestamp = localExpTime ? parseInt(localExpTime) : Date.now()
            const now = Date.now()
            const timestampHavePassed = now - expireTimestamp
            const timeExpire = 1000 * 60 * 60 * 24 * branding.token.expireday
            const timeout = Math.max(timeExpire - timestampHavePassed, 0)
            const cleanup = setInterval(() => {
                clearInterval(cleanup)
                dispatch({
                    type: SessionActionType.SET_TOKEN,
                    payload: null
                })
                cookie.unset(branding.token.name)
                localStorage.removeItem('expireTimestamp')
                history.replace({
                    pathname: '/auth/login',
                    state: {
                        message: branding.token.expireMessage
                    }
                })
            
                if(branding.allowOrganisationSelection) {
                    localStorage.removeItem('selected-organisation')
                    dispatch({
                        type: SessionActionType.SET_OTHERS,
                        payload: {
                            ...others,
                            organisationID: null,
                            hasSelectedOrganisation: false
                        }
                    })
                }
            }, timeout)
            return () => clearInterval(cleanup)
        }
    // eslint-disable-next-line
    }, [token])

    //refresh token new tungsten feature 13/12/2021
    useRefreshToken()
}