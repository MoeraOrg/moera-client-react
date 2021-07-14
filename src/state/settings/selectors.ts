import { ClientSettings, SettingTypes } from "api";
import { ClientState } from "state/state";
import { ClientSettingMetaInfo } from "api/settings";

export function isAtSettingsNodeTab(state: ClientState): boolean {
    return state.settings.tab === "node";
}

export function isAtSettingsClientTab(state: ClientState): boolean {
    return state.settings.tab === "client";
}

export function isSettingsNodeValuesToBeLoaded(state: ClientState): boolean {
    return !state.settings.node.loadedValues && !state.settings.node.loadingValues;
}

export function isSettingsNodeMetaToBeLoaded(state: ClientState): boolean {
    return !state.settings.node.loadedMeta && !state.settings.node.loadingMeta;
}

export function isSettingsClientValuesLoaded(state: ClientState): boolean {
    return state.settings.client.loadedValues;
}

export function getSettingsClientMeta(state: ClientState): Map<string, ClientSettingMetaInfo> {
    return state.settings.client.meta;
}

export function getSetting(state: ClientState, name: string): string | number | boolean | Date | null {
    const meta = state.settings.client.meta.get(ClientSettings.PREFIX + name);
    if (!meta) {
        return null;
    }
    const value = state.settings.client.values.get(ClientSettings.PREFIX + name);
    return SettingTypes.toValue(meta.type, value ?? meta.defaultValue ?? "");
}
