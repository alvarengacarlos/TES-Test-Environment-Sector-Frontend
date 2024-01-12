/**
 * @return {boolean}
 */
export function isAuthenticated() {
    const identityToken = sessionStorage.getItem("identityToken")
    if (identityToken) {
        return true
    } else {
        return false
    }
}