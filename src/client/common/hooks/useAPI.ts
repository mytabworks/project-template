import { useAxios } from './useAxios'
import { AxiosRequestConfig } from 'axios'
import branding from '../../config/branding'

export const useAPI = <P = any>(endpoint: string, options?: AxiosRequestConfig) => {
    return useAxios<P>(branding.services.endpoint, endpoint, {
        // withCredentials: true, 
        method: "POST",
        ...options
    })
}