type CookieSetOption = {
    expireday?: number;
    path?: string;
    secure?: boolean;
    httpOnly?: boolean;
    domain?: string;
}

const cookie = {
    get(key: string) { 
        if(!key) return null
        const decodedCookie = decodeURIComponent(document.cookie);
        const result = decodedCookie.match(new RegExp(`${key}=([^;]+)`));

        return result && result[1]
    },

    set(key: string, value: any, {
        expireday = 1, 
        path = '/',
        secure = false,
        httpOnly = false,
        domain = ''
    }: CookieSetOption) {
        if(!key) return
        const now = new Date() as any
        now.setTime(
            now.getTime() + (expireday*24*60*60*1000)
        ) 
        document.cookie = `${key}=${value};expires=${now.toGMTString()};path=${path};${domain && `domain=${domain};`}${secure ? 'secure;' : ''}${httpOnly ? 'httpOnly' : ''}`;
    },

    unset(key: string, props?: Omit<CookieSetOption, 'expireday'> ) {
        this.set(key, null, {
            expireday: -1,
            ...props
        })
    },

    unsetAll() {
        const decodedCookie = decodeURIComponent(document.cookie);
        decodedCookie.split(";").forEach((cookie) => {
            const [key] = cookie.trim().split("=")
            this.set(key, null, {
                expireday: -1
            })
        })
    }
}

export default cookie