import {guard} from "../util/guard.js";
import {httpRequest} from "../util/httpRequest.js";
import {apiResponseMapping} from "../util/apiResponseMapping.js";
import {errorAlert} from "../util/alert.js";

applications()

function applications() {
    guard()
    uploadNewFile()
    listApps()
}

function uploadNewFile() {
    document.getElementsByTagName("form")[0].addEventListener("submit", async (event) => {
        event.preventDefault()

        const applicationNameInput = document.getElementById("applications-application-name-input")
        const sourceCodeInput = document.getElementById("applications-source-code-input")

        await uploadFile(applicationNameInput, sourceCodeInput)
    })
}

async function uploadFile(applicationNameInput, sourceCodeInput) {
    const result = validate({
        applicationName: applicationNameInput.value,
        sourceCodeType: sourceCodeInput.files[0].type
    })
    if (!result.isValid) {
        errorAlert(result.message)

    } else {
        const formData = new FormData()
        formData.append("appName", applicationNameInput.value)
        formData.append("sourceCodeFile", sourceCodeInput.files[0], sourceCodeInput.files[0].name)

        const apiResponse = await httpRequest("/source-codes", "POST", formData, sessionStorage.getItem("identityToken"), "multipart/form-data")
        try {
            apiResponseMapping(apiResponse)
            applicationNameInput.value = ""
            sourceCodeInput.value = ""
            window.location.reload()

        } catch (error) {
            errorAlert(error.message)
        }
    }
}

/**
 * @param {{applicationName: string, sourceCodeType: string}} inputs
 * @return {{message: string, isValid: boolean}}
 */
function validate(inputs) {
    const isValidEmail = new RegExp("^.{1,10}$")
    if (!isValidEmail.test(inputs.applicationName)) {
        return {
            message: "O campo 'Nome da aplicação' deve conter no mínimo 1 e no máximo 10 caracteres",
            isValid: false
        }
    }

    if (inputs.sourceCodeType != "application/zip") {
        return {
            message: "O campo 'Código fonte' deve conter um arquivo com extensão .zip",
            isValid: false
        }
    }

    return {
        message: "",
        isValid: true
    }
}

function listApps() {
    window.addEventListener("load", async () => {
        Promise.all([
            getSourceCodes(),
            getInfraStacks()
        ]).then(results => {
            if (results[0].sourceCodeEntities.length == 0) {
                return
            }

            const apps = results[0].sourceCodeEntities.map(obj => {
                return {
                    appName: obj.sourceCodePath.split("-")[1],
                    sourceCodePath: obj.sourceCodePath,
                    infraStackId: null,
                    infraStackName: null,
                    infraStackStatus: null
                }
            })

            for (const stack of results[1].infraStacks) {
                const appName = stack.stackName.split("-")[3]
                const index = apps.findIndex(app => app.appName == appName)
                if (index != -1) {
                    apps[index].infraStackId = stack.stackId
                    apps[index].infraStackName = stack.stackName
                    apps[index].infraStackStatus = stack.stackStatus
                }
            }

            let html = ""
            for (let i = 0; i < apps.length; i++) {
                html = `
                    <div>
                        <h3>${apps[i].appName}</h3>
                        <h4>Código fonte:</h4>
                        <form>
                            <input type="text" id="applications-application-name-to-source-code-${i}-input" value="${apps[i].appName}" hidden>
                            <label for="applications-source-code-${i}-input">Código fonte:</label>
                            <input type="file" id="applications-source-code-${i}-input" placeholder="Código fonte">
                            <input type="text" id="applications-source-code-path-to-source-code-${i}-input" value="${apps[i].sourceCodePath}" hidden>
                            <button type="button" name="update-button-${i}">Atualizar</button>
                            <button type="button" name="delete-button-${i}" ${(apps[i].infraStackStatus != null) ? "disabled" : ""}>Deletar</button>
                        </form>                
                        <h4>Infraestrutura:</h4>
                        <p>Estado: ${apps[i].infraStackStatus || "Não provisionado"}</p>
                        <form>
                            <input type="text" id="applications-application-name-to-infra-${i}-input" value="${apps[i].appName}" hidden>
                            <label for="applications-template-type-${i}-input">Tipo do template:</label>
                            <select id="applications-template-type-${i}-input">
                                <option value="CONTAINER_MODEL">Container</option>
                            </select>
                            <input type="text" id="applications-source-code-path-to-infra-${i}-input" value="${apps[i].sourceCodePath}" hidden>
                            <input type="text" id="applications-infra-stack-name-${i}-input" value="${apps[i].infraStackName}" hidden>
                            <button type="button" name="provision-button-${i}" ${(apps[i].infraStackStatus != null) ? "disabled" : ""}>Provisionar</button>
                            <button type="button" name="remove-button-${i}" ${(apps[i].infraStackStatus == null || apps[i].infraStackStatus == "CREATE_IN_PROGRESS" || apps[i].infraStackStatus == "DELETE_IN_PROGRESS") ? "disabled" : ""}>Remover</button>
                        </form>
                    </div>
                `
            }
            const appsContainerDiv = document.getElementById("applications-apps-container-div")
            appsContainerDiv.innerHTML = html
            addEventToUpdateAndDeleteSourceCode()
            addEventToProvisionAndRemoveInfraStack()

        }).catch(error => {
            errorAlert(error.message)
        })
    })
}

async function getInfraStacks() {
    const apiResponse = await httpRequest("/infra-stacks", "GET", null, sessionStorage.getItem("identityToken"))
    try {
        const data = apiResponseMapping(apiResponse)
        return data

    } catch (error) {
        errorAlert(error.message)
    }
}

async function getSourceCodes() {
    const apiResponse = await httpRequest("/source-codes", "GET", null, sessionStorage.getItem("identityToken"))
    try {
        const data = apiResponseMapping(apiResponse)
        return data

    } catch (error) {
        errorAlert(error.message)
    }
}

function addEventToUpdateAndDeleteSourceCode() {
    const numberOfApplications = document.getElementById("applications-apps-container-div").childElementCount
    for (let i = 0; i < numberOfApplications; i++) {
        const updateButton = document.getElementsByName(`update-button-${i}`)[0]
        updateButton.addEventListener("click", async () => {
            const applicationNameInput = document.getElementById(`applications-application-name-to-source-code-${i}-input`)
            const sourceCodeInput = document.getElementById(`applications-source-code-${i}-input`)

            await uploadFile(applicationNameInput, sourceCodeInput)
        })

        const deleteButton = document.getElementsByName(`delete-button-${i}`)[0]
        deleteButton.addEventListener("click", async () => {
            const sourceCodePath = document.getElementById(`applications-source-code-path-to-source-code-${i}-input`).value
            const apiResponse = await httpRequest(`/source-codes/${sourceCodePath}`, "DELETE", null, sessionStorage.getItem("identityToken"))
            try {
                apiResponseMapping(apiResponse)
                window.location.reload()

            } catch (error) {
                errorAlert(error.message)
            }
        })
    }
}

function addEventToProvisionAndRemoveInfraStack() {
    const numberOfApplications = document.getElementById("applications-apps-container-div").childElementCount
    for (let i=0; i<numberOfApplications; i++) {
        const provisionButton = document.getElementsByName(`provision-button-${i}`)[0]
        provisionButton.addEventListener("click", async () => {
            const applicationName = document.getElementById(`applications-application-name-to-infra-${i}-input`).value
            const templateType = document.getElementById(`applications-template-type-${i}-input`).value
            const sourceCodePath = document.getElementById(`applications-source-code-path-to-infra-${i}-input`).value
            const body = {
                appName: applicationName,
                templateType: templateType,
                sourceCodePath: sourceCodePath
            }

            const apiResponse = await httpRequest("/infra-stacks", "POST", body, sessionStorage.getItem("identityToken"))
            try {
                apiResponseMapping(apiResponse)
                window.location.reload()

            } catch (error) {
                errorAlert(error.message)
            }
        })

        const removeButton = document.getElementsByName(`remove-button-${i}`)[0]
        removeButton.addEventListener("click", async () => {
            const infraStackName = document.getElementById(`applications-infra-stack-name-${i}-input`).value

            const apiResponse = await httpRequest(`/infra-stacks/${infraStackName}`, "DELETE", null, sessionStorage.getItem("identityToken"))
            try {
                apiResponseMapping(apiResponse)
                window.location.reload()

            } catch (error) {
                errorAlert(error.message)
            }
        })
    }
}