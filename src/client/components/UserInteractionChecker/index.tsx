import { useAPI } from '@client/common/hooks/useAPI';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef } from 'react'

interface UserInteractionCheckerProps {
    children: React.ReactNode;
}

const UserInteractionChecker: React.FunctionComponent<UserInteractionCheckerProps> = ({children}) => {
    const { data } = useSession()
    const request = useAPI('/api/user/interaction/interacting')
    const once = useRef<boolean>(false)

    useEffect(() => {
        if(data?.user) {
            
            // const handle = () => {
            //     const interacting = document.visibilityState === 'visible'

            //     request.call({
            //         data: {
            //             interacting
            //         }
            //     })
            // }

            // handle()

            // document.addEventListener("visibilitychange", handle);

            // return () => document.removeEventListener("visibilitychange", handle);

            const handle = (interacting: boolean) => () => {
                request.call({
                    data: {
                        interacting
                    }
                })
            }

            const handleBlur = handle(false)

            const handleFocus = handle(true)

            if(once.current === false) {
                once.current = true
                handleFocus()
            }
            
            window.addEventListener('blur', handleBlur, false)
            window.addEventListener('focus', handleFocus, false)

            return () => {
                window.removeEventListener('blur', handleBlur, false)
                window.removeEventListener('focus', handleFocus, false)
            }
        }
    }, [data?.user])

    return (
        <>
            {children}
        </>
    )
}

export default UserInteractionChecker
