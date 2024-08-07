window.addEventListener("load", async function() {
    const isDetail = document.URL.includes("detail")
    const openArticleInNewWindows = await getSetting("optionOpenArticleInNewWindow", defaultSettings.optionOpenArticleInNewWindow)
    setHighlightColumn()
    if (!openArticleInNewWindows) {
        insertScript(document, "src/override-main.js")
        document.body.append(viewer())
    }
    if (isDetail) {
        document.body.prepend(viewerToolbar(isDetail))
        insertCSS([
            "src/nsb-core.css",
            "src/nsb-article.css"
        ])
    } else {
        setToolbar()
        setSearchBar()
        setSearchResult()
        insertCSS([
            "src/nsb-core.css",
            "src/nsb-main.css"
        ])
    }
    createToast()
})

/**
 * Highlight flagged article
 * @return void
 */
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

/**
 * Remove style attribute in a tag
 * @return void
 */
function removeStyle() {
    const links = document.querySelectorAll("a, td, span")
    for(let i=0; i < links.length; i++) {
        links[i].removeAttribute("style")
    }
}

/**
 * Set toolbar style
 * @return void
 */
function setToolbar() {
    const toolbar = document.querySelector("div")
    toolbar.classList.add("nsb-toolbar")
    toolbar.removeAttribute("style")
}

/**
 * Set search bar style
 * @return void
 */
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
    searchInputs[1].classList.add(classMaterialSymbols)
    searchInputs[1].classList.add("icon-button")
    searchInputs[1].removeAttribute("style")
    searchInputs[2].setAttribute("style", "display:none;")
}

/**
 * Set search result style
 * @return void
 */
function setSearchResult() {
    const divs = document.querySelectorAll("div")
    if (divs.length < 3) {
        return
    }
    const result = divs[2]
    result.classList.add("nsb-search-result")
}

/**
 * Create popup article viewer
 * @returns {HTMLDivElement}
 */
function viewer() {
    const viewerContent = document.createElement("iframe")
    viewerContent.classList.add("nsb-viewer-content")
    viewerContent.onload = onViewerLoad
    viewerContent.setAttribute("name", "nsb-viewer-content")
    viewerContent.setAttribute("id", "nsb-viewer-content")
    const viewer = document.createElement("div")
    viewer.classList.add("nsb-viewer")
    viewer.append(viewerToolbar(false))
    viewer.append(viewerContent)
    const viewerBackground = document.createElement("div")
    viewerBackground.classList.add("nsb-viewer-background")
    viewerBackground.append(viewer)
    return viewerBackground
}

/**
 * Create viewer toolbar
 * @param {boolean} isDetail
 * @returns {HTMLDivElement}
 */
function viewerToolbar(isDetail) {
    const viewerClose = document.createElement("button")
    viewerClose.setAttribute("type", "button")
    viewerClose.classList.add("nsb-viewer-toolbar-close")
    viewerClose.classList.add("icon-button")
    viewerClose.append(createMaterialSymbol("close"))
    viewerClose.onclick = () => closeArticle(isDetail)
    const viewerPrint = document.createElement("button")
    viewerPrint.setAttribute("type", "button")
    viewerPrint.classList.add("icon-button")
    viewerPrint.append(createMaterialSymbol("print"))
    viewerPrint.onclick = () => printArticle(isDetail)
    const viewerCopy = document.createElement("button")
    viewerCopy.setAttribute("type", "button")
    viewerCopy.classList.add("icon-button")
    viewerCopy.append(createMaterialSymbol("content_copy"))
    viewerCopy.onclick = () => copyArticleContent(isDetail)
    const viewerUrl = document.createElement("button")
    viewerUrl.setAttribute("type", "button")
    viewerUrl.classList.add("icon-button")
    viewerUrl.append(createMaterialSymbol("link"))
    viewerUrl.onclick = () => copyArticleUri(isDetail)
    const viewerFlag = document.createElement("button")
    viewerFlag.setAttribute("type", "button")
    viewerFlag.classList.add("icon-button")
    viewerFlag.append(createMaterialSymbol("star"))
    viewerFlag.onclick = () => flagArticle(isDetail)
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
    return viewerToolbar
}