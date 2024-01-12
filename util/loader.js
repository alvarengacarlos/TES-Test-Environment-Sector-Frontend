export function addLoader() {
    const body = document.getElementsByTagName("body")[0]
    body.children[0].hidden = true

    const loaderSpan0 = document.createElement("span")
    loaderSpan0.className = "visually-hidden"
    loaderSpan0.textContent = "Carregando..."
    const loaderDiv0 = document.createElement("div")
    loaderDiv0.className = "spinner-grow"
    loaderDiv0.role = "status"
    loaderDiv0.appendChild(loaderSpan0)

    const loaderSpan1 = document.createElement("span")
    loaderSpan1.className = "visually-hidden"
    loaderSpan1.textContent = "Carregando..."
    const loaderDiv1 = document.createElement("div")
    loaderDiv1.className = "spinner-grow ms-1 me-1"
    loaderDiv1.role = "status"
    loaderDiv1.appendChild(loaderSpan0)

    const loaderSpan2 = document.createElement("span")
    loaderSpan2.className = "visually-hidden"
    loaderSpan2.textContent = "Carregando..."
    const loaderDiv2 = document.createElement("div")
    loaderDiv2.className = "spinner-grow"
    loaderDiv2.role = "status"
    loaderDiv2.appendChild(loaderSpan0)

    const mainLoaderDiv = document.createElement("div")
    mainLoaderDiv.id = "main-loader-div"
    mainLoaderDiv.appendChild(loaderDiv0)
    mainLoaderDiv.appendChild(loaderDiv1)
    mainLoaderDiv.appendChild(loaderDiv2)
    mainLoaderDiv.className = "d-flex flex-row justify-content-center align-items-center mt-5"

    body.appendChild(mainLoaderDiv)
}

export function removeLoader() {
    const body = document.getElementsByTagName("body")[0]
    body.children[0].hidden = false

    const loaderDiv = document.getElementById("main-loader-div")
    body.removeChild(loaderDiv)
}