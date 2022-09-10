import { useRef, useEffect, MutableRefObject } from 'react'

export const useUnmounted = (): MutableRefObject<boolean> => {
    const unmounted = useRef<boolean>(false)

    useEffect(() => {
        return () => {
            unmounted.current = true
        }
    }, [])

    return unmounted
}