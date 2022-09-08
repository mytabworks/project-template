import { useState, useEffect } from "react";
import { useLoginAPI } from "./useLoginAPI";
import { FormEvent } from "formydable";

export const useLoginLogic = (others?: Record<string, any>) => {
    const [rememberMe, setRememberMe] = useState<boolean>(false)

    const requestLogin = useLoginAPI()

    const username = localStorage.getItem("username")

    useEffect(() => {
        setRememberMe(!!username)
    // eslint-disable-next-line
    }, []);

    const handleRememberMe = (event: any) => {
        setRememberMe(event.target.checked)
    }

    const handleSubmit = (event: FormEvent) => {
        if (event.isReady()) {
            const FORM_DATA = event.json()

            const data = {
                username: FORM_DATA.email,
                password: FORM_DATA.password,
                others
            };

            if(rememberMe) {
                localStorage.setItem("username", FORM_DATA.email)
            } else {
                localStorage.removeItem("username")
            }
            
            requestLogin.call(data).then((response) => {
                if(!response.data?.success) {
                    event.setFieldError('email', response.data?.message)
                }
            })
        }
    }

    return {
        requestLogin,
        username,
        rememberMe,
        handleRememberMe,
        handleSubmit
    }
}