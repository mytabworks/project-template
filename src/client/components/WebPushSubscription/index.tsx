import React, { useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import { useAPI } from "@client/common/hooks/useAPI";
import { useSession } from 'next-auth/react';
// add mode_active: boolean and last_mode_active: Date ; user
// user mode_active = true don't push notification rather normal notif on page else push notif.
// https://github.com/shadowwalker/next-pwa/tree/master/examples/web-push
// https://github.com/shadowwalker/next-pwa/tree/master/examples/custom-worker

const isSupported = typeof window !== "undefined" && "serviceWorker" in window.navigator;

const WebPushSubscription: React.FunctionComponent = () => {
    const requestSubscribe = useAPI('/api/feature/webpush/subscribe')
    const requestUnsubscribe = useAPI('/api/feature/webpush/unsubscribe')

	const {data} = useSession()
	const [isSubscribe, setIsSubscribe] = useState<boolean>(false);

	useEffect(() => {
        if(isSupported) {
            navigator.serviceWorker.ready.then((serviceWorker) => {
                serviceWorker.pushManager.getSubscription().then((pushInstance) => {
                    setIsSubscribe(pushInstance !== null)
                })
            })
        }
	}, [])

	const handleToggler = async (event: any) => {
        const isEnabled = event.target.checked
        try {
            const serviceWorker = await navigator.serviceWorker.ready
            if (isEnabled) {
                
                const pushInstance = await serviceWorker.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY
                })
                const pushSubscription = pushInstance.toJSON()
                
                const payload = {
                    userID: data?.user?.id,
                    ...pushSubscription
                }
                
                setIsSubscribe(true)

                // const toast = Toaster('Subscribing Browser Notification')
                requestSubscribe.call({
                    data: payload
                })
                .then((response) => {
                    if(response.data.success) {
                        // toast.success(response.data.message)
                        setIsSubscribe(true)
                    } else {
                        // toast.fail(response.data.message)
                    }
                })
                .catch(() => {
                    // toast.error()
                })
                
            } else {
                const pushInstance = await serviceWorker.pushManager.getSubscription()

                if(pushInstance) {
                    const pushSubscription = pushInstance.toJSON()
                    
                    const payload = {
                        userID: data?.user?.id,
                        ...pushSubscription
                    }

                    pushInstance.unsubscribe()
                    setIsSubscribe(false)
                    // const toast = Toaster('Unsubscribing Browser Notification')
                    requestUnsubscribe.call({
                        data: payload
                    })
                    .then((response) => {
                        if(response.data.success) {
                            // toast.success(response.data.message)
                            pushInstance.unsubscribe()
                            setIsSubscribe(false)
                        } else {
                            // toast.fail(response.data.message)
                        }
                    })
                    .catch(() => {
                        // toast.error()
                    })
                }
            }
        } catch(error) {
            console.log(error)
        }
	}
    
    return (
        <Form.Group className="d-flex align-items-center">
			<Form.Check 
                type="switch"
                id="web-push-sub"
                checked={isSubscribe}
                label="Subscribe Notification"
                onChange={handleToggler}/>
        </Form.Group>
    )
}

export default WebPushSubscription