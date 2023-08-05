/**
 * @file Override methods in main page
 *
 */

/**
 * Name of iframe in viewer
 * @type {string}
 */
const classIframe = "nsb-viewer-content"

/**
 * Override f_open method in main page
 * This method open new window using given arguments. However, Popup viewer does not need new window. So disable it to
 * further stability.
 * This method return current Window instance whether error does not occur.
 * @param {number} width
 * @param {number} height
 * @param {string} target
 * @param {string} next
 * @param {string} option
 * @return {undefined | Window}
 */
function f_open(width, height, target, next, option) {
    // Cancel timeout called from `detail`
    const dummy = setTimeout(() => {}, 1)
    for(let i=0; i < 2; i++) {
        clearTimeout(dummy-i)
    }
    // Generate URI (copied from webpage)
    let	uri= document.form1.action
        +	"?uri="			+ document.form1.uri.value
        +	"&next_uri="	+ next;
    if (option !== "") {
        uri	= uri + "&" + option;
    }

    const iframe = document.querySelector("." + classIframe)
    if (iframe === null) {
        console.error("Disable the extension to read article")
        return
    }
    iframe.setAttribute("src", uri)
    return window
}