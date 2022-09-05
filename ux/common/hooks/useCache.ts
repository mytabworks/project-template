import { useRef } from 'react'

export const useCache = <P = any>(value: any, changeCache: boolean): P | null => {
    const cache = useRef(null)
    if(changeCache) {
        cache.current = value
    }
    return cache.current
}