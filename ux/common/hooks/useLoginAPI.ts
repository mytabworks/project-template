import { useHistory } from "react-router-dom"
import { useSession, SessionActionType } from "../../components/Session"
import Toaster from "../../components/Toaster"
import cookie from "../utils/cookie"
import { useAPI } from "./useAPI"
import branding from "@config/branding"
import { excludeDuplicate } from "../utils/data"

export const useLoginAPI = (requiresEmailConfirmation: boolean = true) => {
    const history = useHistory()
    const [{others}, dispatch] = useSession()
    const request = useAPI('/api/Authenticate')

    return {
        ...request,
        call({ username, password, mfaCode, others: otherProps }: { username: string; password: string, mfaCode?: string; others?: Record<string, any> }) {
            const payload = {
                ...otherProps,
                username: username,
                password: password,
                mfaCode
            }
            
            return request.call({
                data: payload
            })
            .then((response) => {
                if (response.data.success) {
                    const token = response.data.token
                    cookie.set(branding.token.name, token, { expireday: branding.token.expireday, domain: branding.token.domain })
                    localStorage.setItem('expireTimestamp', Date.now().toString())
                    
                    dispatch({
                        type: SessionActionType.SET_TOKEN,
                        payload: token,
                    });

                    if(branding.allowOrganisationSelection) {
                        const organisationIDs = response.data.organisationIDs
    
                        if(excludeDuplicate(organisationIDs).length > 1) {
    
                            Toaster.success("Which Organisation do you want to access in this session?");
    
                            history.push("/auth/select-organisation");
                            
                        } else {
                            const defaultOrganisationID = organisationIDs[0] || null
                            localStorage.setItem('selected-organisation', defaultOrganisationID || '')
                            dispatch({
                                type: SessionActionType.SET_OTHERS,
                                payload: {
                                    ...others,
                                    organisationID: defaultOrganisationID,
                                    hasSelectedOrganisation: true
                                }
                            })
                        }
                    }
                } else if (response.data?.requiresMFA) {
                    history.push("/auth/mfa", { ...payload });

                    Toaster.success(response.data.message);
                
                } else if(requiresEmailConfirmation && response.data.requiresEmailConfirmation) {

                    history.push({
                        pathname: "/auth/confirm-email",
                        state: { username, password },
                    })
                }

                return response
            })
            .catch(() => {
                request.setError('Something went wrong')
                
                return Promise.reject()
            })
        }
    }
}