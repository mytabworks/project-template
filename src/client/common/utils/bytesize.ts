const bytesize = (bytes: number) => {
    const t = 1000
    const kilobytes = bytes/t
    const megabytes = kilobytes/t
    const isKilobyte = bytes >= t
    const isMegabyte = kilobytes >= t
    const isGigabyte = megabytes >= t
    const byteType = isGigabyte ? 'gb' : isMegabyte ? 'mb' : isKilobyte ? 'kb' : 'b'
    const size = isGigabyte ? (megabytes/t).toFixed(1) : isMegabyte ? (kilobytes/t).toFixed(2) : isKilobyte ? Math.round(kilobytes) : bytes
    return size + byteType
}

export default bytesize