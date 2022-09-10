export const dateFormat = (date: string | Date, localization: string = 'en-GB', ...args: any[]) => {
    return new Date(date).toLocaleDateString(localization, ...args)
}

export const dateTimeFormat = (date: string | Date, localization: string = 'en-GB', ...args: any[]) => {
    return new Date(date).toLocaleString(localization, ...args)
}

export const timeFormat = (date: string | Date, localization: string = 'en-GB', ...args: any[]) => {
    return new Date(date).toLocaleTimeString(localization, ...args)
}