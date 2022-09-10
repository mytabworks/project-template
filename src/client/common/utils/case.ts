const normalizeCamel = (str: string) => str.replace(/[a-z]([A-Z])/g, (found) => `${found[0]} ${found[1].toLowerCase()}`)

export const camel = (str: string) => { 
        return str.replace(/(?:-|_|\s)+?(\w)/g, (_, first) => first.toUpperCase())
}
export const dash = (str: string) => { 
        return normalizeCamel(str).replace(/(?:_|\s)/g, '-')
}
export const snake = (str: string) => { 
        return normalizeCamel(str).replace(/(?:-|\s)/g, '_')
}
export const normalize = (str: string) => { 
        return normalizeCamel(str).replace(/(?:-|_)/g, ' ')
}
export const capitalize = (str: string) => { 
        return normalizeCamel(str)
            .replace(/(?:-|_|\s)+?(\w)/g, (_, capital) => ` ${capital.toUpperCase()}`)
            .replace(/^([a-z])/, (_, capital) => `${capital.toUpperCase()}`)
}