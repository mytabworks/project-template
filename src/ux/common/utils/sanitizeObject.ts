import is from "./is"

const sanitizeObject = (object: Record<string, any>) => {
    return Object.keys(object).reduce<Record<string, any>>((result, key) => {
        
        if(!is.und(object[key])) {
            result[key] = object[key]
        }

        return result
    }, {})
}

export default sanitizeObject