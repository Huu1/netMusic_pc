export const formatSongDuration = (duration) => {
    let left: any = Math.floor(duration / 60)
    let right: any = Math.floor(duration % 60)
    return repairZero(left) + ":" + repairZero(right)
}
const repairZero = (val) => {
    return val < 10 ? '0' + val : val
}