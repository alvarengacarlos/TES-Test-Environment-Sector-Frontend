export function logout() {
    document.getElementById("logout-link").addEventListener("click", (event) => {
        event.preventDefault()
        sessionStorage.removeItem("identityToken")
        sessionStorage.removeItem("identityTokenType")
        sessionStorage.removeItem("refreshToken")
        window.location.replace("sign-in.html")
    })
}