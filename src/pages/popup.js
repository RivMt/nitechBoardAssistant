window.addEventListener("load", event => {
    // Edit version
    document.getElementById("version").innerText = chrome.runtime.getManifest().version
    // Apply event
    addOnClickEvent()
})

function addOnClickEvent() {
    // Checkbox
    const checkBoxes = document.querySelectorAll("input[type='checkbox']")
    for(let i=0; i < checkBoxes.length; i++) {
        checkBoxes[i].onclick = () => onCheckboxValueChanged(checkBoxes[i].id)
    }
}