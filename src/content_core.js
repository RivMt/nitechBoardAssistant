const materialSymbols = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"

const classMaterialSymbols = "material-symbols-outlined"

function insertScript(document, file) {
    const script = document.createElement("script")
    script.src = chrome.runtime.getURL(file)
    document.head.append(script)
}

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

function createMaterialSymbol(code) {
    const symbol = document.createElement("span")
    symbol.classList.add(classMaterialSymbols)
    symbol.innerText = code
    return symbol
}

function createToast() {
    const toast = document.createElement("div")
    toast.setAttribute("id", "nsb-toast")
    toast.setAttribute("style", "display: none;")
    document.body.append(toast)
}

function showToast(message) {
    const toast = document.getElementById("nsb-toast")
    toast.innerText = message
    toast.removeAttribute("style")
    setTimeout(() => {
        toast.setAttribute("style", "display: none;")
    }, 3000)
}