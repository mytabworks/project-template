import { useRouter } from 'next/router'
import React from 'react'
import ClientMiddleware from '@client/middleware'

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

export const getServerSideProps = ClientMiddleware.redirects({ [3]: '/customer' }).unauth()

export default Hello
