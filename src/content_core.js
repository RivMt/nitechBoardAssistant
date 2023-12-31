/**
 * Uri of material symbols style file
 * @type {string}
 */
const materialSymbols = "https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp"

/**
 * Class name of material symbols
 * @type {string}
 */
const classMaterialSymbols = "material-icons-outlined"

window.addEventListener("load", async () => {
    includeMaterialSymbols()
    removeTableStyle(document)
    setTableHeader(document)
    removeStyle()
})

/**
 * Insert material symbol CSS
 * @return void
 */
function includeMaterialSymbols() {
    const material = document.createElement("link")
    material.setAttribute("rel", "stylesheet")
    material.setAttribute("href", materialSymbols)
    document.querySelector("head").append(material)
}

/**
 * Insert CSS to current tab
 * This method sends message to service worker to insert CSS.
 * @param {string[]} css List of CSS files
 * @return void
 */
function insertCSS(css) {
    chrome.runtime.sendMessage(
        {
            "data": actionInsertCss,
            "css": css
        },
        function (response) {
            if (!response.result) {
                console.error(response)
            }
        }
    )
}

/**
 * Insert JavaScript file to document
 * @param {Document} document
 * @param {string} file
 * @return void
 */
function insertScript(document, file) {
    const script = document.createElement("script")
    script.src = chrome.runtime.getURL(file)
    document.head.append(script)
}

/**
 * Remove table style given by tag attributes.
 * @param {Document} document
 * @return void
 */
function removeTableStyle(document) {
    const table = document.querySelector("table")
    if (table !== null) {
        table.removeAttribute("style")
    }
    const tds = document.querySelectorAll("td")
    for(let i=0; i < tds.length; i++) {
        tds[i].removeAttribute("valign")
        tds[i].removeAttribute("bgcolor")
        tds[i].removeAttribute("style")
    }
}

/**
 * Set first row of table as header
 * @param {Document} document
 * @return void
 */
function setTableHeader(document) {
    const head = document.querySelector("tr")
    if (head === null) {
        return
    }
    head.classList.add("nsb-header")
    const headers = head.querySelectorAll("a, span")
    for(let i=0; i < headers.length; i++) {
        headers[i].classList.add("nsb-header-title")
    }
}

/**
 * Create material symbol icon
 * @param {string} code Code of material symbol
 * @returns {HTMLSpanElement}
 */
function createMaterialSymbol(code) {
    const symbol = document.createElement("span")
    symbol.classList.add(classMaterialSymbols)
    symbol.innerText = code
    return symbol
}

/**
 * Create toast component to current document
 * @return void
 */
function createToast() {
    const toast = document.createElement("div")
    toast.setAttribute("id", "nsb-toast")
    toast.setAttribute("style", "display: none;")
    document.body.append(toast)
}

/**
 * Show toast message to current document
 * @param {string} message
 * @return void
 */
function showToast(message) {
    const toast = document.getElementById("nsb-toast")
    toast.innerText = message
    toast.removeAttribute("style")
    setTimeout(() => {
        toast.setAttribute("style", "display: none;")
    }, 3000)
}