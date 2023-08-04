window.addEventListener("load", async (event) => {
    await initPage()
})

async function initPage() {
    const inputs = document.querySelectorAll("input[type=\"checkbox\"]")
    for(let i=0; i < inputs.length; i++) {
        const key = inputs[i].getAttribute("id")
        let value = await getSetting(key, defaultSettings[key])
        if (typeof value !== "boolean") {
            value = defaultSettings[key]
        }
        inputs[i].checked = value
    }
}

async function onCheckboxValueChanged(key) {
    const value = document.getElementById(key)
    await setSetting(key, value.checked)
    value.checked = await getSetting(key, value.checked)
}