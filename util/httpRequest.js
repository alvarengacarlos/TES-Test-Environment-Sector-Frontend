import {env} from "../env.js"

/**
 * @param string path
 * @param {"POST", "GET", "PUT", "DELETE"} method
 * @param object body
 * @param string authorization
 * @param {"application/json", "multipart/form-data"} contentType
 * @return {Promise<{apiStatusCode: string, message: string, data: object}>}
 */
export async function httpRequest(
    path,
    method,
    body = null,
    authorization = "",
    contentType = "application/json")
{
    const init = {
        method: method,
        headers: {
            "Content-Type": contentType,
            "Authorization": authorization
        },
        mode: "cors",
        body: JSON.stringify(body)
    }

    if (body == null) {
        delete init.body
    }

    if (authorization == "") {
        delete init.headers.Authorization
    }

    const httpResponse = await fetch(env.TES_API_BASE_URL.concat(path), init)
    return await httpResponse.json()
}