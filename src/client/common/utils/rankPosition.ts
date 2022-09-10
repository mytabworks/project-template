const rankPosition = (rank: number) => {
    if(/1$/.test(`${rank}`)) {
        return `${rank}st`
    } else if(/2$/.test(`${rank}`)) {
        return `${rank}nd`
    } else if(/3$/.test(`${rank}`)) {
        return `${rank}rd`
    } else {
        return `${rank}th`
    }
}

export default rankPosition