const keySettings = "settings"

const keySyncSettings = "sync_settings"

const defaultSettings = {
    optionOpenArticleInNewWindow: false
}

async function getSyncSettings() {
    const value = await chrome.storage.local.get(keySyncSettings)
    if (typeof value !== "boolean") {
        await setSyncSettings(true)
        return true
    }
    return value
}

async function setSyncSettings(value) {
    const data = {}
    data[keySyncSettings] = value
    return await chrome.storage.local.set(data)
}

async function getSettings() {
    const useSync = await getSyncSettings()
    const storage = (useSync) ? chrome.storage.sync : chrome.storage.local
    return await storage.get()
}

async function setSettings(settings) {
    const useSync = await getSyncSettings()
    const storage = useSync ? chrome.storage.sync : chrome.storage.local
    await storage.set(settings)
}

function isObject(data) {
    return typeof data === 'object' && keySettings in data
}

async function getSetting(key, value) {
    let settings = await getSettings()
    if (!isObject(settings)) {
        settings = {}
        await setSettings(settings)
        console.debug(`Settings INIT`)
    }
    if (!(keySettings in settings)) {
        settings[keySettings] = {}
        await setSettings(settings)
        console.debug(`Settings NONE`)
    }
    if (!(key in settings[keySettings])) {
        settings[keySettings][key] = value
        await setSettings(settings)
        console.debug(`Settings NR ${key}: ${value}`)
        return value
    }
    console.debug(`Settings GET ${key}: ${settings[keySettings][key]}`)
    return settings[keySettings][key]
}

async function setSetting(key, value) {
    const settings = await getSettings()
    if (!isObject(settings)) {
        console.debug(`Settings ERR ${key}`)
        return false
    }
    settings[keySettings][key] = value
    await setSettings(settings)
    console.debug(`Settings SET ${key}: ${value}`)
    return true
}

async function removeSetting(key) {
    const settings = await getSettings()
    if (!isObject(settings) || !(key in settings)) {
        return false
    }
    delete settings[keySettings][key]
    await setSettings(settings)
    return true
}

async function pushSettingItem(key, value) {
    const settings = await getSettings()
    if (!isObject(settings) || !(key in settings[keySettings]) || !Array.isArray(settings)) {
        return false
    }
    settings[keySettings][key].push(value)
    await setSettings(settings)
    return true
}

async function popSettingItem(key) {
    const settings = await getSettings()
    if (!isObject(settings) || !(key in settings[keySettings]) || !Array.isArray(settings)) {
        return false
    }
    const pop = settings[keySettings][key].pop()
    await setSettings(settings)
    return pop
}

async function peekSettingItem(key, index) {
    const settings = await getSettings()
    if (!isObject(settings) || !(key in settings[keySettings]) || !Array.isArray(settings)) {
        return false
    }
    if (index === null || index < 0 || index >= settings[key].length) {
        index = settings[keySettings][key].length-1
    }
    return settings[keySettings][key][index]
}