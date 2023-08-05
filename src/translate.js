/**
 * @file Translate current webpage
 */

window.addEventListener("load", event => {
    // Apply translation
    applyTranslation()
})

/**
 * Apply translations to element which is 'translate' class
 * @return void
 */
function applyTranslation() {
    const list = document.body.getElementsByClassName('translate')
    for(let i=0; i < list.length; i++) {
        list[i].innerText = chrome.i18n.getMessage(list[i].getAttribute('key'))
    }
}