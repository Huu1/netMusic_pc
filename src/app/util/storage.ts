
export const setCurrentSong = (key, val) => {
    localStorage.setItem(key, val)
}
export const getCurrentSong = (key) => {
    return localStorage.getItem(key)
}