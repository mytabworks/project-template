import { useLayoutEffect, useEffect } from "react"

export const useScreenTitle = (title: string) => {

    useLayoutEffect(() => {
        const prevTitle = document.title
        
        document.title = title

        return () => {
            document.title = prevTitle
        }
    }, [title])
}

export const useActionScreenTitle = (title: string) => {

    useEffect(() => {
        const prevTitle = document.title
        
        document.title = title

        return () => {
            document.title = prevTitle
        }
    }, [title])
}