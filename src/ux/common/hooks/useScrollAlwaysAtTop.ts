import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export const useScrollAlwaysAtTop = () => {
    const location = useLocation()
    useEffect(() => {
		if(document?.documentElement) {
			document.documentElement.scrollTop = 0
		}
	}, [location.pathname])
}