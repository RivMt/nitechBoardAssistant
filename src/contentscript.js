const actionInsertCss = "actionInsertCss"

const materialSymbols = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"

window.onload = async function() {
    const isDetail = document.URL.includes("detail")
    includeMaterialSymbols()
    requestInsertCSS()
    removeTableCellStyle()
    setTableHeader()
    setHighlightColumn()
    removeLinkStyle()
    setToolbar()
    setSearchBar()
}

function includeMaterialSymbols() {
    const material = document.createElement("link")
    material.setAttribute("rel", "stylesheet")
    material.setAttribute("href", materialSymbols)
    document.querySelector("head").append(material)
}

function requestInsertCSS() {
    chrome.runtime.sendMessage(
        {
            "data": actionInsertCss
        },
        function (response) {
            if (!response.result) {
                console.error(response)
            }
        }
    )
}

function removeTableCellStyle() {
    const tds = document.querySelectorAll("td")
    for(let i=0; i < tds.length; i++) {
        tds[i].removeAttribute("valign")
        tds[i].removeAttribute("bgcolor")
    }
}

function setTableHeader() {
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

function setHighlightColumn() {
    const onlyUnread = document.querySelector("div").querySelector("input").checked
    const columns = document.querySelectorAll("tr")
    for(let i=0; i < columns.length; i++) {
        const inputs = columns[i].querySelectorAll("input")
        if (inputs.length === 0) {
            continue
        }
        const read = inputs[0].checked
        const flag = inputs[3].checked
        if (!read && !onlyUnread) {
            columns[i].classList.add("nsb-unread")
        }
        if (flag) {
            columns[i].classList.add("nsb-flag")
        }
    }
}

function removeLinkStyle() {
    const links = document.querySelectorAll("a, td, span")
    for(let i=0; i < links.length; i++) {
        links[i].removeAttribute("style")
    }
}

function setToolbar() {
    const toolbar = document.querySelector("div")
    toolbar.classList.add("nsb-toolbar")
    toolbar.removeAttribute("style")
}

function setSearchBar() {
    const searchBar = document.querySelectorAll("div")[1]
    searchBar.classList.add("nsb-toolbar")
    searchBar.classList.add("nsb-toolbar-right")
    searchBar.removeAttribute("style")
    searchBar.removeAttribute("align")
    searchBar.innerHTML = searchBar.innerHTML.replace("検索キーワード", "")
    const searchInputs = searchBar.querySelectorAll("input")
    searchInputs[0].classList.add("inputfield")
    searchInputs[0].removeAttribute("style")
    searchInputs[1].innerHTML = ""
    searchInputs[1].setAttribute("value", "search")
    searchInputs[1].classList.add("material-symbols-outlined")
    searchInputs[1].classList.add("icon-button")
    searchInputs[1].removeAttribute("style")
    searchInputs[2].setAttribute("style", "display:none;")
}

function toggleViewer() {
    const viewer = document.querySelector(".nsb-viewer-background")
    if (viewer.getAttribute("style") !== null) {
        viewer.removeAttribute("style")
    } else {
        viewer.setAttribute("style", "display:none;")
    }
}

function createMaterialSymbol(code) {
    const symbol = document.createElement("span")
    symbol.classList.add("material-symbols-outlined")
    symbol.innerText = code
    return symbol
}