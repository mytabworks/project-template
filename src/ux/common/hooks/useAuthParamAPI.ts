import { AxiosRequestConfig } from "axios"
import { useAuthAPI } from "./useAuthAPI"

export const useAuthParamAPI = (endpoint: string, options: AxiosRequestConfig = { method: 'DELETE' }) => {
    const request = useAuthAPI('', options)

    return {
        ...request,
        call: (data: Record<any, any>) => {

            const url = Object.keys(data).reduce((result, key) => {
                return result.replace(new RegExp(`{${key}}`, 'g'), data[key])
            }, endpoint)

            return request.call({
                url
            })
        }
    }
}