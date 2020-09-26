export const setLocalstorage = (key, val) => {
    localStorage.setItem(key, val)
}
export const getLocalstorage = (key) => {
    return localStorage.getItem(key)
}