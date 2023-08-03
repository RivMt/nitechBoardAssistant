const actionInsertCss = "actionInsertCss"

window.onload = async function() {
    const isDetail = document.URL.includes("detail")
    includeMaterialSymbols()
    insertCSS()
    insertScript(document, "src/override.js")
    removeTableStyle(document)
    setTableHeader(document)
    setHighlightColumn()
    removeLinkStyle()
    setToolbar()
    setSearchBar()
    setSearchResult()
    createViewer()
    createToast()
}

function includeMaterialSymbols() {
    const material = document.createElement("link")
    material.setAttribute("rel", "stylesheet")
    material.setAttribute("href", materialSymbols)
    document.querySelector("head").append(material)
}

function insertCSS() {
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
    searchInputs[0].setAttribute("placeholder", chrome.i18n.getMessage("placeholderSearchBar"))
    searchInputs[1].innerHTML = ""
    searchInputs[1].setAttribute("value", "search")
    searchInputs[1].classList.add("material-symbols-outlined")
    searchInputs[1].classList.add("icon-button")
    searchInputs[1].removeAttribute("style")
    searchInputs[2].setAttribute("style", "display:none;")
}

function setSearchResult() {
    const divs = document.querySelectorAll("div")
    if (divs.length < 3) {
        return
    }
    const result = divs[2]
    result.classList.add("nsb-search-result")
}

function createViewer() {
    const viewerClose = document.createElement("button")
    viewerClose.classList.add("nsb-viewer-toolbar-close")
    viewerClose.classList.add("icon-button")
    viewerClose.append(createMaterialSymbol("close"))
    viewerClose.onclick = closeIframe
    const viewerPrint = document.createElement("button")
    viewerPrint.classList.add("icon-button")
    viewerPrint.append(createMaterialSymbol("print"))
    viewerPrint.onclick = printIframe
    const viewerCopy = document.createElement("button")
    viewerCopy.classList.add("icon-button")
    viewerCopy.append(createMaterialSymbol("content_copy"))
    viewerCopy.onclick = copyIframeContent
    const viewerUrl = document.createElement("button")
    viewerUrl.classList.add("icon-button")
    viewerUrl.append(createMaterialSymbol("link"))
    viewerUrl.onclick = copyIframeSrc
    const viewerFlag = document.createElement("button")
    viewerFlag.classList.add("icon-button")
    viewerFlag.append(createMaterialSymbol("star"))
    viewerFlag.onclick = flagIframe
    const viewerAction = document.createElement("div")
    viewerAction.classList.add("nsb-viewer-toolbar-action")
    viewerAction.append(viewerPrint)
    viewerAction.append(viewerCopy)
    viewerAction.append(viewerUrl)
    viewerAction.append(viewerFlag)
    const viewerToolbar = document.createElement("div")
    viewerToolbar.classList.add("nsb-viewer-toolbar")
    viewerToolbar.append(viewerClose)
    viewerToolbar.append(viewerAction)
    const viewerContent = document.createElement("iframe")
    viewerContent.classList.add("nsb-viewer-content")
    viewerContent.onload = onIframeLoad
    viewerContent.setAttribute("name", "nsb-viewer-content")
    viewerContent.setAttribute("id", "nsb-viewer-content")
    const viewer = document.createElement("div")
    viewer.classList.add("nsb-viewer")
    viewer.append(viewerToolbar)
    viewer.append(viewerContent)
    const viewerBackground = document.createElement("div")
    viewerBackground.classList.add("nsb-viewer-background")
    viewerBackground.append(viewer)
    const body = document.querySelector("body")
    body.append(viewerBackground)
}