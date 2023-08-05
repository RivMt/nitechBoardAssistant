/**
 * Key of all settings
 * @type {string}
 */
const keySettings = "settings"

/**
 * Key of sync settings or not
 * @type {string}
 */
const keySyncSettings = "sync_settings"

/**
 * Default value of settings
 * @type {Object}
 */
const defaultSettings = {
    optionOpenArticleInNewWindow: false
}

/**
 * Get sync preference
 * @returns {Promise<boolean> | boolean}
 */
async function getSyncSettings() {
    const value = await chrome.storage.local.get(keySyncSettings)
    if (typeof value !== "boolean") {
        await setSyncSettings(true)
        return true
    }
    return value
}

/**
 * Set sync preference
 * @param {boolean} value
 * @returns {Promise<void>}
 */
async function setSyncSettings(value) {
    const data = {}
    data[keySyncSettings] = value
    return await chrome.storage.local.set(data)
}

/**
 * Get all settings
 * @returns {Object | string | number | boolean | Array}
 */
async function getSettings() {
    const useSync = await getSyncSettings()
    const storage = (useSync) ? chrome.storage.sync : chrome.storage.local
    return await storage.get()
}

/**
 * Set all settings.
 * You must give argument as whole settings. If part of settings provided, non-included key and values will be deleted.
 * @param {Object | string | number | boolean | Array} settings
 * @returns {Promise<void>}
 */
async function setSettings(settings) {
    const useSync = await getSyncSettings()
    const storage = useSync ? chrome.storage.sync : chrome.storage.local
    await storage.set(settings)
}

/**
 * Check given argument is Object or not
 * @param {any} data
 * @returns {boolean}
 */
function isObject(data) {
    return typeof data === 'object' && keySettings in data
}

/**
 * Get value of specific key from settings.
 * If there are no key, set value as default value of key and return it.
 * @param {string} key
 * @param {Object | string | number | boolean | Array} value
 * @returns {Promise<Object | string | number | boolean | Array>}
 */
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

/**
 * Set value of key from settings
 * @param {string} key
 * @param {Object | string | number | boolean | Array} value
 * @returns {Promise<Object | string | number | boolean | Array>}
 */
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

/**
 * Remove key and its value
 * Return true if it is successful.
 * @param {string} key
 * @returns {Promise<boolean>}
 */
async function removeSetting(key) {
    const settings = await getSettings()
    if (!isObject(settings) || !(key in settings)) {
        return false
    }
    delete settings[keySettings][key]
    await setSettings(settings)
    return true
}

/**
 * Push value to last entry of key
 * It returns true when value of key is Array.
 * @param {string} key
 * @param {Object | string | number | boolean | Array} value
 * @returns {Promise<boolean>}
 */
async function pushSettingItem(key, value) {
    const settings = await getSettings()
    if (!isObject(settings) || !(key in settings[keySettings]) || !Array.isArray(settings)) {
        return false
    }
    settings[keySettings][key].push(value)
    await setSettings(settings)
    return true
}

/**
 * Pop the last entry of key
 * It returns false value of key is not entry or key does not exist.
 * @param {string} key
 * @returns {Promise<Object | string | number | boolean | Array>}
 */
async function popSettingItem(key) {
    const settings = await getSettings()
    if (!isObject(settings) || !(key in settings[keySettings]) || !Array.isArray(settings)) {
        return false
    }
    const pop = settings[keySettings][key].pop()
    await setSettings(settings)
    return pop
}

/**
 * Peek the last entry of key
 * It returns false value of key is not entry or key does not exist.
 * Also, index is out of range, the last entry will be peeked.
 * @param {string} key
 * @param {number} index
 * @returns {Promise<Object | string | number | boolean | Array>}
 */
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