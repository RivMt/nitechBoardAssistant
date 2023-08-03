const actionInsertCss = "actionInsertCss"

const materialSymbols = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"

const classMaterialSymbols = "material-symbols-outlined"

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

function getIframe() {
    return document.querySelector("iframe#nsb-viewer-content")
}

function setIframeSrc(uri) {
    const iframe = getIframe()
    if (iframe === null) {
        return
    }
    iframe.setAttribute("src", uri)
}

function setIframeArticleStyle() {
    const iframe = getIframe()
    if (iframe === null) {
        return
    }
    const table = iframe.contentWindow.document.querySelector("table")
    if (table === null) {
        return
    }
    table.setAttribute("id", "nsb-viewer-content-table")
    const article = iframe.contentWindow.document.querySelectorAll("tr")[4]
    if (article === null) {
        return
    }
    article.classList.add("nsb-viewer-content-article")
}

function setIframeArticleFlagButton() {
    const iframe = getIframe()
    if (iframe === null) {
        return
    }
    const inputs = iframe.contentWindow.document.querySelectorAll("input")
    if (inputs.length < 7) {
        return
    }
    const flag = inputs[6].value.includes("非")
    const buttons = document.querySelectorAll("button")
    if (buttons.length < 5) {
        return
    }
    if (flag) {
        buttons[4].classList.add("nsb-flag")
    } else {
        buttons[4].classList.remove("nsb-flag")
    }
}

async function onIframeLoad() {
    const viewer = document.querySelector(".nsb-viewer-background")
    if (viewer === null) {
        return
    }
    const iframe = getIframe()
    if (iframe === null) {
        return
    }
    const uri = iframe.getAttribute("src")
    if (uri !== null && uri !== "") {
        viewer.removeAttribute("style")
        const css = iframe.contentWindow.document.createElement("link")
        css.setAttribute("rel", "stylesheet")
        css.setAttribute("href", chrome.runtime.getURL("src/theme.css"))
        iframe.contentWindow.document.head.append(css)
        insertScript(iframe.contentWindow.document, "src/override.js")
        removeTableStyle(iframe.contentWindow.document)
        setTableHeader(iframe.contentWindow.document)
        setIframeArticleStyle()
        setIframeArticleFlagButton()
        // Set title
        const title = iframe.contentWindow.document.getElementById("nsb-viewer-content-table").querySelectorAll("td")[1].innerText
        iframe.setAttribute("title", title)
    } else {
        // Hide
        viewer.setAttribute("style", "display:none;")
        viewer.setAttribute("title", "")
    }
}

function closeIframe() {
    setIframeSrc("")
    const form = document.querySelector("form")
    form.submit()
}

function printIframe() {
    const iframe = getIframe()
    if (iframe === null) {
        return
    }
    iframe.contentWindow.print()
}

function flagIframe() {
    const iframe = getIframe()
    if (iframe === null) {
        return
    }
    const toolbar = iframe.contentWindow.document.querySelector("#print_display")
    const flag = toolbar.querySelectorAll("input")[3]
    flag.click()
    setTimeout(closeIframe, 100)
}

function copyIframeContent() {
    const iframe = getIframe()
    if (iframe === null) {
        return
    }
    const content = iframe.contentWindow.document.querySelector(".nsb-viewer-content-article")
    if (content === null) {
        return
    }
    window.navigator.clipboard.writeText(content.innerText).then(r => console.error(`Failed to copy content`))
    showToast("Content copied")
}

function copyIframeSrc() {
    const iframe = getIframe()
    if (iframe === null) {
        return
    }
    window.navigator.clipboard.writeText(iframe.src).then(r => console.error(`Failed to copy URL`))
    showToast("Content copied")
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