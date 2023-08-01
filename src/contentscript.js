const actionInsertCss = "actionInsertCss"

window.onload = async function() {
    const isDetail = document.URL.includes("detail")
    requestInsertCSS()
    setValign()
    setTableHeader()
    setHighlightColumn()
    removeLinkStyle()
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

function setValign() {
    const tds = document.querySelectorAll("td")
    for(let i=0; i < tds.length; i++) {
        tds[i].removeAttribute("valign")
        tds[i].removeAttribute("bgcolor")
    }
}

function setTableHeader() {
    const head = document.querySelector("tr")
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