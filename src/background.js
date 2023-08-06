/**
 * Value of script import is successful or not
 * @type {boolean}
 */
let error = false

try {
    importScripts("/src/constants.js")
} catch (e) {
    error = true
    console.error(e)
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (error) {
        sendResponse({
            "result": false
        })
    }
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