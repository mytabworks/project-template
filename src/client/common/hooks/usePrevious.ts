import { useRef, useEffect, MutableRefObject } from 'react'

export const usePrevious = <P = any>(value: P): P => {
    const previous = useRef<any>(value)

    useEffect(() => {
        return () => {
            previous.current = value
        }
    }, [value])

    return previous.current
}