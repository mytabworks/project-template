export const dateFormat = (date: string | Date, localization: string = 'en-GB', ...args: any[]) => {
    return new Date(date).toLocaleDateString(localization, ...args)
}

export const dateTimeFormat = (date: string | Date, localization: string = 'en-GB', ...args: any[]) => {
    return new Date(date).toLocaleString(localization, ...args)
}

export const timeFormat = (date: string | Date, localization: string = 'en-GB', ...args: any[]) => {
    return new Date(date).toLocaleTimeString(localization, ...args)
}

const leadingZero = (num: number) => num <= 9 ? `0${num}` : num

export const dateTimeWithoutTimezone = (date: Date) => {
    const day = leadingZero(date.getDate())
    const month = leadingZero(date.getMonth() + 1)
    const year = date.getFullYear()
    const hours = leadingZero(date.getHours())
    const minutes = leadingZero(date.getMinutes())
    const seconds = leadingZero(date.getSeconds())

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export const dateWithoutTimezone = (date: Date) => {
    const day = leadingZero(date.getDate())
    const month = leadingZero(date.getMonth() + 1)
    const year = date.getFullYear()

    return `${year}-${month}-${day}`
}

export const timeWithoutTimezone = (date: Date) => {
    const hours = leadingZero(date.getHours())
    const minutes = leadingZero(date.getMinutes())
    const seconds = leadingZero(date.getSeconds())

    return `${hours}:${minutes}:${seconds}`
}
