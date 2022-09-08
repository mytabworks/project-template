import Button from "../../components/Button"
import Icon from "../../components/Icon"
import Toaster from "../../components/Toaster"
import React, { useEffect, useState } from "react"
import { useAxios } from "./useAxios"

export const useUpdateApplication = (minutesInterval = 15) => {
    const [shown, setShown] = useState(false)
    const requestAppJSON = useAxios(window?.location?.origin, '', { method: 'GET'})
    
    useEffect(() => {
        if(shown) return;

        const call = (status: any) => {
            requestAppJSON.call({
                url: `/app.json?r=${Date.now()}`
            }).then((response) => {
                const requestVersion = response.data.version
                const currentVersion = localStorage.getItem('app-version')
                if(requestVersion !== currentVersion) {
                    localStorage.setItem('app-version', requestVersion)
                    if(status !== 'initial') {
                        setShown(true)
                        Toaster.retoast({
                            body: (
                                <div className="toaster-content">
                                    <Icon name="sync-alt" spin/>
                                    <div className="toaster-message">New App Version {requestVersion}</div>
                                    <Button variant="outline-info" className="ml-3" onClick={() => window?.location.reload()}>Update Now</Button>
                                </div>
                            ),
                            variant: 'info',
                            placement: 'bottom-right',
                            duration: 0,
                            dismissible: false
                        })
                    }
                }
            })
        }
        
        call('initial')
        
        const cleanup = setInterval(call, minutesInterval * 1000 * 60)

        return () => clearInterval(cleanup)
        // minutes interval
    }, [shown])
}