import { useEffect, useRef } from "react"

export const useEffectMounted = (callback: () => (() => void) | void, deps: any[]) => {
    const mounted = useRef<boolean>(false)

    useEffect(() => {
        if(mounted.current) {
            return callback()
        }
    // eslint-disable-next-line 
    }, deps)

    useEffect(() => {
        mounted.current = true
    // eslint-disable-next-line 
    }, [])
}