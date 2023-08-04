

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

function closeIframe(isDetail) {
    if (isDetail) {
        window.close()
        return
    }
    setIframeSrc("")
    const form = document.querySelector("form")
    form.submit()
}

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