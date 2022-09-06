import { useRouter } from 'next/router'
import React from 'react'

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

export default Hello
