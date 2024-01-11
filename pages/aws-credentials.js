import {guard} from "../util/guard.js";
import {errorAlert, successAlert} from "../util/alert.js";
import {httpRequest} from "../util/httpRequest.js";
import {apiResponseMapping} from "../util/apiResponseMapping.js";
import {logout} from "../util/logout.js";
import {addLoader, removeLoader} from "../util/loader.js";

awsCredentials()

function awsCredentials() {
    guard()
    logout()

    disabledButtons()

    saveAwsCredentials()
    updateAwsCredentials()
    deleteAwsCredentials()
}

function disabledButtons() {
    window.addEventListener("load", async (event) => {
        const buttons = document.getElementsByTagName("button")
        const saveButton = buttons[0]
        const updateButton = buttons[1]
        const deleteButton = buttons[2]

        const apiResponse = await httpRequest("/aws-credentials/exists", "GET", null, sessionStorage.getItem("identityToken"))
        try {
            const data = apiResponseMapping(apiResponse)
            if (data.exists == true) {
                saveButton.disabled = true
            } else {
                updateButton.disabled = true
                deleteButton.disabled = true
            }
        } catch (error) {
            errorAlert(error.message)
        }
    })
}

function saveAwsCredentials() {
    const buttons = document.getElementsByTagName("button")
    const saveButton = buttons[0]

    saveButton.addEventListener("click", async () => {
        const accessKeyIdInput = document.getElementById("aws-credentials-access-key-id-input")
        const secretAccessKeyInput = document.getElementById("aws-credentials-secret-access-key-input")

        const body = {
            accessKeyId: accessKeyIdInput.value,
            secretAccessKey: secretAccessKeyInput.value
        }
        const result = validate(body)
        if (!result.isValid) {
            errorAlert(result.message)

        } else {
            addLoader()
            const apiResponse = await httpRequest("/aws-credentials", "POST", body, sessionStorage.getItem("identityToken"))
            try {
                apiResponseMapping(apiResponse)
                successAlert("Credenciais da AWS salvas com sucesso")
                accessKeyIdInput.value = ""
                secretAccessKeyInput.value = ""
                window.location.reload()

            } catch (error) {
                removeLoader()
                errorAlert(error.message)
            }
        }
    })
}

/**
 * @param {{accessKeyId: string, secretAccessKey: string}} inputs
 * @return {{message: string, isValid: boolean}}
 */
function validate(inputs) {
    const isValidAccessKeyId = new RegExp("^.{20}$")
    if (!isValidAccessKeyId.test(inputs.accessKeyId)) {
        return {
            message: "O campo 'Access key ID' não é um campo válido",
            isValid: false
        }
    }

    const isValidSecretAccessKey = new RegExp("^.{40}$")
    if (!isValidSecretAccessKey.test(inputs.secretAccessKey)) {
        return {
            message: "O campo 'Secret access key' não e um campo válido",
            isValid: false
        }
    }

    return {
        message: "",
        isValid: true
    }
}

function updateAwsCredentials() {
    const buttons = document.getElementsByTagName("button")
    const updateButton = buttons[1]

    updateButton.addEventListener("click", async () => {
        const accessKeyIdInput = document.getElementById("aws-credentials-access-key-id-input")
        const secretAccessKeyInput = document.getElementById("aws-credentials-secret-access-key-input")

        const body = {
            accessKeyId: accessKeyIdInput.value,
            secretAccessKey: secretAccessKeyInput.value
        }
        const result = validate(body)
        if (!result.isValid) {
            errorAlert(result.message)

        } else {
            addLoader()
            const apiResponse = await httpRequest("/aws-credentials", "PUT", body, sessionStorage.getItem("identityToken"))
            try {
                apiResponseMapping(apiResponse)
                successAlert("Credenciais da AWS atualizadas com sucesso")
                accessKeyIdInput.value = ""
                secretAccessKeyInput.value = ""
                window.location.reload()

            } catch (error) {
                removeLoader()
                errorAlert(error.message)
            }
        }
    })
}

function deleteAwsCredentials() {
    const buttons = document.getElementsByTagName("button")
    const deleteButton = buttons[2]

    deleteButton.addEventListener("click", async () => {
        addLoader()
        const apiResponse = await httpRequest("/aws-credentials", "DELETE", null, sessionStorage.getItem("identityToken"))
        try {
            apiResponseMapping(apiResponse)
            successAlert("Credenciais da AWS deletadas com sucesso")
            window.location.reload()

        } catch (error) {
            removeLoader()
            errorAlert(error.message)
        }
    })
}