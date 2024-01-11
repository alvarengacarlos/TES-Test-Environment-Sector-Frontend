import {errorAlert} from "../util/alert.js";
import {httpRequest} from "../util/httpRequest.js";
import {apiResponseMapping} from "../util/apiResponseMapping.js";
import {addLoader, removeLoader} from "../util/loader.js";

confirmSignUp()

function confirmSignUp() {
    const searchParams = new URLSearchParams(window.location.search)
    document.getElementById("confirm-sign-up-email-input").value = searchParams.get("email")

    document.getElementsByTagName("form")[0].addEventListener("submit", async (event) => {
        event.preventDefault()

        const emailInput = document.getElementById("confirm-sign-up-email-input").value
        const confirmationCodeInput = document.getElementById("confirm-sign-up-confirmation-code-input").value

        const body = {
            email: emailInput,
            confirmationCode: confirmationCodeInput
        }
        const result = validate(body)
        if (!result.isValid) {
            errorAlert(result.message)

        } else {
            addLoader()
            const apiResponse = await httpRequest("/confirm-sign-up", "POST", body)
            try {
                apiResponseMapping(apiResponse)
                window.location.replace("sign-in.html")

            } catch (error) {
                removeLoader()
                errorAlert(error.message)
            }
        }
    })
}

/**
 * @param {{email: string, confirmationCode: string}} inputs
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

    console.log(inputs.confirmationCode)
    const isValidConfirmationCode = new RegExp("^\\d{6}$")
    if (!isValidConfirmationCode.test(inputs.confirmationCode)) {
        return {
            message: "O campo 'Código de confirmação' deve conter 6 números",
            isValid: false
        }
    }

    return {
        message: "",
        isValid: true
    }
}