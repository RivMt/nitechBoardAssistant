const actionInsertCss = "actionInsertCss"

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.data) {
        case actionInsertCss:
            insertCss(sender.tab.id, message.key)
            sendResponse({
                "result": true
            })
            break
    }
    sendResponse({
        "result": false
    })
})

function insertCss(tabId) {
    const css = ["src/theme.css"]
    chrome.scripting.insertCSS({
        files: css,
        target: {
            tabId: tabId
        }
    })
    console.debug("Injection complete")
}