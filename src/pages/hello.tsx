import { useRouter } from 'next/router'
import React from 'react'
import ClientMiddleware from '@client/middleware'
import { RoleType } from '@server/model/Role'

interface HelloProps {
    
}

const Hello: React.FunctionComponent<HelloProps> = (props) => {
    const route = useRouter()
    
    return (
        <>
            Hello
            <a href="#" onClick={(e) => {
                e.preventDefault()
                route.back()
            }}>Back</a>
        </>
    )
}

export const getServerSideProps = ClientMiddleware.redirects({ [RoleType.CLIENT]: '/customer' }).unauth()

export default Hello
