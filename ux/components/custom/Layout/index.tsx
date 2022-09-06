import { useAPI } from '@hooks/useAPI'
import React, { useEffect } from 'react'

interface LayoutProps {
    
}

const Layout: React.FunctionComponent<LayoutProps> = (props) => {
    const request = useAPI('/api/user', { method: "GET" })

	useEffect(() => {
		request.call().then(() => {

        })
    }, [])
    
    return (
        <>
        
        </>
    )
}

export default Layout
