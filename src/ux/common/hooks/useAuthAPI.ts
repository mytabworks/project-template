import { AxiosRequestConfig } from 'axios'
import { useSession } from '../../components/Session'
import { useAPI } from './useAPI'

export const useAuthAPI = <P = any>(endpoint: string, options?: AxiosRequestConfig) => {
    const [{token}] = useSession()
    return useAPI<P>(endpoint, {
        method: "POST",
        ...options, 
        headers: {
            "Authorization": `Bearer ${token}`,
            ...options?.headers
        }
    })
}