import { useMemo, useRef } from "react"

type CB<P> = (prev: P) => P

export const useObservable = <P = Record<string, any>>(content: P): [P, ((callback: P | CB<P>) => void)] => {
    const observables = useRef(content)

    return useMemo(() => {
        return [
            observables.current, 
            (callback: P | CB<P>) => {
                observables.current = typeof callback === 'function' ? (callback as CB<P>)(observables.current) : callback
            }
        ]
    }, [observables.current])
}