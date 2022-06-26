import { ClientSettings, SettingTypes } from "api";
import { ClientSettingMetaInfo } from "api/settings";
import { SettingValue } from "api/setting-types";
import { SettingMetaInfo } from "api/node/api-types";
import { ClientState } from "state/state";

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

export function isSettingsClientValuesToBeLoaded(state: ClientState): boolean {
    return !state.settings.client.loadedValues && !state.settings.client.loadingValues;
}

export function isSettingsClientValuesLoaded(state: ClientState): boolean {
    return state.settings.client.loadedValues;
}

export function getSettingsClientMeta(state: ClientState): Map<string, ClientSettingMetaInfo> {
    return state.settings.client.meta;
}

export function getSettingNodeMeta(state: ClientState, name: string): SettingMetaInfo | null {
    return state.settings.node.meta.get(name) ?? null;
}

export function getSettingNode(state: ClientState, name: string): SettingValue | null {
    const meta = getSettingNodeMeta(state, name);
    if (!meta) {
        return null;
    }
    const value = state.settings.node.values.get(name);
    return SettingTypes.toValue(meta.type, value ?? meta.defaultValue ?? "");
}

export function getSettingMeta(state: ClientState, name: string): ClientSettingMetaInfo | null {
    return state.settings.client.meta.get(ClientSettings.PREFIX + name) ?? null;
}

export function getSetting(state: ClientState, name: string): SettingValue | null {
    const meta = getSettingMeta(state, name);
    if (!meta) {
        return null;
    }
    const value = state.settings.client.values.get(ClientSettings.PREFIX + name);
    return SettingTypes.toValue(meta.type, value ?? meta.defaultValue ?? "");
}
