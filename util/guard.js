import {isAuthenticated} from "./isAuthenticated.js";
import {errorAlert} from "./alert.js";

export function guard() {
    if (!isAuthenticated()) {
        errorAlert("Você não esta autenticado")
        window.location.replace("sign-in.html")
    }
}