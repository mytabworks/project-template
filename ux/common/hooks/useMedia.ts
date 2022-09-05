import { useState, useEffect } from "react"
import media from "../utils/media"

export const useMedia = (query: string) => {
    const [matches, setMatches] = useState<boolean>(false)

    useEffect(() => {

        const handler = (event: MediaQueryList) => {
            setMatches(event.matches)
        }
        
        return media(query, handler)

    }, [query])

    return matches
}