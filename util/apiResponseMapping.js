/**
 * @param {{apiStatusCode: string, message: string, data: object}} apiResponse
 * @throws Error
 * @return object
 */
export function apiResponseMapping(apiResponse) {
    const apiStatusCode = apiResponse.apiStatusCode
    const message = apiResponse.message
    const data = apiResponse.data
    switch (apiStatusCode) {
        case "SUCCESS":
            return data
            break
        case "INVALID_INPUT":
            console.error(message)
            throw new Error("Os dados fornecidos são inválidos")
            break
        case "RESOURCE_NOT_FOUND":
            console.error(message)
            throw new Error("O recurso não foi encontrado")
            break
        case "INTERNAL_ERROR":
            console.error(message)
            throw new Error("Erro interno do servidor")
            break
        case "EMAIL_EXISTS":
            console.error(message)
            throw new Error("O email já está em uso")
            break
        case "EXPIRED_CONFIRMATION_CODE":
            console.error(message)
            throw new Error("O código de confirmação expirou")
            break
        case "INVALID_CONFIRMATION_CODE":
            console.error(message)
            throw new Error("O código de confirmação é inválido")
            break
        case "INCORRECT_EMAIL_OR_PASSWORD":
            console.error(message)
            throw new Error("Email ou senha são inválidos")
            break
        case "EMAIL_NOT_CONFIRMED":
            console.error(message)
            throw new Error("O email não foi confirmado")
            break
        default:
            console.error("Unknown error")
            throw new Error("Erro desconhecido.")
    }
}
