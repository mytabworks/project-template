import { useState } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export interface UseAxiosStates<P> {
    initial: boolean;
    loading: boolean;
    complete: boolean;
    success: string | null;
    error: string | null;
    response: P | null
}

export interface UseAxiosReturn<P> extends UseAxiosStates<P> {
    call: (overideOptions?: AxiosRequestConfig) => Promise<AxiosResponse<P>>,
    setError: (error: string | null) => void,
    setSuccess: (error: string | null) => void,
    setResponse: (error: string | null) => void,
}

export const useAxios = <P = any>(baseurl: string, endpoint: string, options: AxiosRequestConfig = { method: "POST" }) => {
    const [states, setStates] = useState<UseAxiosStates<P>>({
        initial: true,
        loading: false,
        complete: true,
        error: null,
        success: null,
        response: null
    })
    return {
        ...states,
        call(overideOptions: AxiosRequestConfig = {}): Promise<AxiosResponse<P>> {
            setStates((prev) => ({
                ...prev, 
                loading: true, 
                complete: false, 
            }))
            return axios({
                ...options,
                ...overideOptions,
                url: `${baseurl}${'url' in overideOptions ? overideOptions.url : endpoint}`,
                headers: {
                    ...options.headers,
                    ...overideOptions?.headers
                },
            })
            .then((response) => {
                setStates((prev) => ({
                    ...prev,
                    initial: false,
                    loading: false, 
                    complete: true,
                    error: null,
                    success: null,
                    response: response.data
                }))
                return response
            })
            .catch((error) => {
                setStates((prev) => ({
                    ...prev, 
                    initial: false,
                    loading: false, 
                    complete: true, 
                    success: null,
                    error: error.message
                }))
                return Promise.reject(error)
            })
        },
        setError(error: string | null) {
            setStates((prev) => ({
                ...prev,
                error,
            }))
        },
        setSuccess(success: string | null) {
            setStates((prev) => ({
                ...prev,
                success,
            }))
        },
        setResponse(response: P | null) {
            setStates((prev) => ({
                ...prev,
                response,
            }))
        }
    }
}