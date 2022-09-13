import { useAPI } from '@client/common/hooks/useAPI';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react'

interface UserInteractionCheckerProps {
    children: React.ReactNode;
}

const UserInteractionChecker: React.FunctionComponent<UserInteractionCheckerProps> = ({children}) => {
    const { data } = useSession()
    const request = useAPI('/api/user/interaction/interacting')

    useEffect(() => {
        if(data?.user) {
            const handle = () => {
                const interacting = document.visibilityState === 'visible'

                request.call({
                    data: {
                        interacting
                    }
                })
            }
            
            handle()

            document.addEventListener("visibilitychange", handle);

            return () => document.removeEventListener("visibilitychange", handle);
        }
    }, [data?.user])

    return (
        <>
            {children}
        </>
    )
}

export default UserInteractionChecker
