import { useEffect } from 'react'
import worldTrigger from 'world-trigger'

export const useWorldTrigger = <P = any>(triggerName: string, callback: (data: P) => void, deps: any[] = []) => {
    useEffect(() => {
        worldTrigger.addTrigger(triggerName, callback)

        return () => worldTrigger.removeTrigger(triggerName, callback)
    }, deps)
}