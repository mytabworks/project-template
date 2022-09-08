import { DocumentNode, useQuery } from "@apollo/client"
import { useEffect, useMemo, useRef } from "react"

type Props = {
    gql: DocumentNode;
    variables: Record<string, any>;
    onReload: () => void;
    queryKey?: string;
    interval?: number;
}

export const useRefresherOrb = ({
    gql, 
    variables, 
    onReload, 
    queryKey = 'refresher',
    interval = 60000
}: Props) => {
    const prev = useRef<number[]>([])

    const request = useQuery<any>(gql, {
        fetchPolicy: 'no-cache',
        variables
    })

    const ids = useMemo(() => ((request.data && request.data[queryKey]?.items) || []).map((item: any) => item.ID), [request.data])

    useEffect(() => {
        if(ids.length > 0) {
            const cleanup = setInterval(() => {
                request.refetch()
            }, interval)
    
            return () => {
                clearInterval(cleanup)
            }
        }
    }, [ids.join(',')])

    useEffect(() => {
        if(prev.current.length > 0 && (ids.length !== prev.current.length || ids.join(',') !== prev.current.join(','))) {
            onReload()
        }
        return () => {
            prev.current = ids
        }
    }, [ids])
}