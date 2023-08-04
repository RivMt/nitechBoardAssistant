const actionInsertCss = "actionInsertCss"

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.data) {
        case actionInsertCss:
            insertCss(sender.tab.id, message.css)
            sendResponse({
                "result": true
            })
            break
    }
    sendResponse({
        "result": false
    })
})

function insertCss(tabId, css) {
    chrome.scripting.insertCSS({
        files: css,
        target: {
            tabId: tabId
        }
    })
    console.debug("Injection complete")
}