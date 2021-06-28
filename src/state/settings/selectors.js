import { ClientSettings, SettingTypes } from "api";

export function isAtSettingsNodeTab(state) {
    return state.settings.tab === "node";
}

export function isAtSettingsClientTab(state) {
    return state.settings.tab === "client";
}

export function isSettingsNodeValuesToBeLoaded(state) {
    return !state.settings.node.loadedValues && !state.settings.node.loadingValues;
}

export function isSettingsNodeMetaToBeLoaded(state) {
    return !state.settings.node.loadedMeta && !state.settings.node.loadingMeta;
}

export function isSettingsClientValuesLoaded(state) {
    return state.settings.client.loadedValues;
}

export function getSettingsClientMeta(state) {
    return state.settings.client.meta;
}

export function getSetting(state, name) {
    const meta = state.settings.client.meta.get(ClientSettings.PREFIX + name);
    if (!meta) {
        return null;
    }
    const value = state.settings.client.values.get(ClientSettings.PREFIX + name);
    return SettingTypes.toValue(meta.type, value != null ? value : meta.defaultValue, meta.modifiers);
}
