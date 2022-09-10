const second = 1000
const minute = 60 * second
const hour = 60 * minute
const day = 24 * hour
const month = 30 * day
const year = 365 * day
const variables: Record<string, number> = {
    year,
    month,
    day,
    hour,
    minute,
}
const variablesKeys = Object.keys(variables)

const diffForHuman = (time: string | Date | number) => {
    const recieved = new Date(time).getTime()
    const now = Date.now()
    const ago = now - recieved
    
    return variablesKeys.reduce((result: string, key: string, _, array) => {
        if(ago > variables[key]) {
            array.splice(0)
            const agoCount = Math.floor(ago / variables[key])
            return `${agoCount} ${key}${agoCount > 1 ? 's': ''} ago`
        }
        return result;
    }, "a seconds ago")
}

export default diffForHuman