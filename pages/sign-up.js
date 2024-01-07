import {errorAlert} from "../util/alert.js";
import {httpRequest} from "../util/httpRequest.js";
import {apiResponseMapping} from "../util/apiResponseMapping.js";

signUp()

function signUp() {
    document.getElementsByTagName("form")[0].addEventListener("submit", async (event) => {
        event.preventDefault()

        const emailInput = document.getElementById("sign-up-email-input").value
        const passwordInput = document.getElementById("sign-up-password-input").value

        const body = {
            email: emailInput,
            password: passwordInput
        }
        const result = validate(body)
        if (!result.isValid) {
            errorAlert(result.message)

        } else {
            const apiResponse = await httpRequest("/sign-up", "POST", body)
            try {
                const data = apiResponseMapping(apiResponse)
                window.location.replace(`confirm-sign-up.html?email=${data.email}`)

            } catch (error) {
                errorAlert(error.message)
            }
        }
    })
}

/**
 * @param {{email: string, password: string}} inputs
 * @return {{message: string, isValid: boolean}}
 */
function validate(inputs) {
    const isValidEmail = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")
    if (!isValidEmail.test(inputs.email)) {
        return {
            message: "O campo 'Email' não é um campo válido",
            isValid: false
        }
    }

    const hasOneLowerCaseCharacter = new RegExp("^(?=.*[a-z]).*$")
    if (!hasOneLowerCaseCharacter.test(inputs.password)) {
        return {
            message: "O campo 'Senha' deve conter ao menos uma letra minúscula",
            isValid: false
        }
    }

    const hasOneUpperCaseCharacter = new RegExp("^(?=.*[A-Z]).*$")
    if (!hasOneUpperCaseCharacter.test((inputs.password))) {
        return {
            message: "O campo 'Senha' deve conter ao menos uma letra maiuscula",
            isValid: false
        }
    }

    const hasOneNumericalCharacter = new RegExp("^(?=.*\\d).*$")
    if (!hasOneNumericalCharacter.test(inputs.password)) {
        return {
            message: "O campo 'Senha' deve conter ao menos um número",
            isValid: false
        }
    }

    const hasOneSpecialCharacter = new RegExp("^(?=.*[@$!%*?&]).*$")
    if (!hasOneNumericalCharacter.test(inputs.password)) {
        return {
            message: "O campo 'Senha' deve conter ao menos um caracter especial: @, $, !, %, *, ?, &",
            isValid: false
        }
    }

    return {
        message: "",
        isValid: true
    }
}