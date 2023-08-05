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

/**
 * Insert css file to tab specified by tabId
 * @param {number} tabId
 * @param {string[]} css
 * @return void
 */
function insertCss(tabId, css) {
    chrome.scripting.insertCSS({
        files: css,
        target: {
            tabId: tabId
        }
    })
    console.debug("Injection complete")
}