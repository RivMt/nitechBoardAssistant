/**
 * Get iframe tag from document
 * @returns {HTMLIFrameElement}
 */
function getIframe() {
    return document.querySelector("iframe#nsb-viewer-content")
}

/**
 * Set iframe src attribute
 * @param {string} uri
 * @return void
 */
function setIframeSrc(uri) {
    const iframe = getIframe()
    if (iframe === null) {
        return
    }
    iframe.setAttribute("src", uri)
}

/**
 * Set article style in iframe
 * @return void
 */
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

/**
 * Set flag button in iframe
 * @return void
 */
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

/**
 * Triggers on iframe src changes
 * If url is empty or null, hide article viewer.
 * If url is not empty or null, execute followings
 * 1. Display article viewer
 * 2. Insert CSS files
 * 3. Insert JavaScript file to override webpage functions
 * 4. Set title attribute of iframe as article title
 * @returns {Promise<void>}
 */
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
        const cssCore = iframe.contentWindow.document.createElement("link")
        cssCore.setAttribute("rel", "stylesheet")
        cssCore.setAttribute("href", chrome.runtime.getURL("src/nsb-core.css"))
        iframe.contentWindow.document.head.append(cssCore)
        const cssArticle = iframe.contentWindow.document.createElement("link")
        cssArticle.setAttribute("rel", "stylesheet")
        cssArticle.setAttribute("href", chrome.runtime.getURL("src/nsb-article.css"))
        iframe.contentWindow.document.head.append(cssArticle)
        insertScript(iframe.contentWindow.document, "src/override-article.js")
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

/**
 * Close iframe
 * If isDetail is true, close current window. But it is false, set iframe src as empty and submit form.
 * @param {boolean} isDetail
 * @return void
 */
function closeIframe(isDetail) {
    if (isDetail) {
        window.close()
        return
    }
    setIframeSrc("")
    const form = document.querySelector("form")
    form.submit()
}

/**
 * Print current article
 * If isDetail is true, print current window. Or not, print iframe instead.
 * @param {boolean} isDetail
 * @return void
 */
function printIframe(isDetail) {
    if (isDetail) {
        window.print()
        return
    }
    const iframe = getIframe()
    if (iframe === null) {
        return
    }
    iframe.contentWindow.print()
}

/**
 * Toggle current article as flagged or unflagged.
 * @param {boolean} isDetail
 * @return void
 */
function flagIframe(isDetail) {
    let w = window
    if (!isDetail) {
        const iframe = getIframe()
        if (iframe === null) {
            return
        }
        w = iframe.contentWindow
    }
    const toolbar = w.document.querySelector("#print_display")
    const flag = toolbar.querySelectorAll("input")[3]
    flag.click()
    setTimeout(closeIframe, 100)
}

/**
 * Copy content of current article
 * @param {boolean} isDetail
 * @return void
 */
function copyIframeContent(isDetail) {
    let content = null
    if (isDetail) {
        const trs = document.querySelectorAll("tr")
        if (trs.length < 5) {
            return
        }
        content = trs[4]
    } else {
        const iframe = getIframe()
        if (iframe === null) {
            return
        }
        content = iframe.contentWindow.document.querySelector(".nsb-viewer-content-article")
        if (content === null) {
            return
        }
    }
    window.navigator.clipboard.writeText(content.innerText).then(r => console.error(`Failed to copy content`))
    const message = chrome.i18n.getMessage("messageContentCopied")
    showToast(message)
}

/**
 * Copy uri of current article
 * @param {boolean} isDetail
 * @return void
 */
function copyIframeSrc(isDetail) {
    let uri = ""
    if (isDetail) {
        uri = window.location
    } else {
        const iframe = getIframe()
        if (iframe === null) {
            return
        }
        uri = iframe.src
    }
    window.navigator.clipboard.writeText(uri).then(r => console.error(`Failed to copy URL`))
    const message = chrome.i18n.getMessage("messageUrlCopied")
    showToast(message)
}