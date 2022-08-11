import { ClientSettings, SettingTypes } from "api";
import { ClientSettingMetaInfo } from "api/settings";
import { SettingValue } from "api/setting-types";
import { SettingMetaInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { isConnectedToHome } from "state/home/selectors";
import { getNodeFeatures } from "state/node/selectors";
import { Browser } from "ui/browser";

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

export function isSettingsAtAddonsSheet(state: ClientState): boolean {
    console.log(state.settings.tab, state.settings.sheet);
    return state.settings.tab === "node" && state.settings.sheet === "addons";
}

export function isSettingsTokensToBeLoaded(state: ClientState): boolean {
    return !state.settings.tokens.loaded && !state.settings.tokens.loading;
}

export function getSettingsClientMeta(state: ClientState): Map<string, ClientSettingMetaInfo> {
    return state.settings.client.meta;
}

export function getSettingsClient(state: ClientState): Map<string, string | null> {
    return state.settings.client.values;
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

export function getPostingBodyFontMagnitude(state: ClientState): number {
    const name = Browser.isTinyScreen() ? "posting.body.font-magnitude.mobile" : "posting.body.font-magnitude";
    return getSetting(state, name) as number;
}

export function getFeedWidth(state: ClientState): number {
    const feedWidth = getSetting(state, "feed.width") as number;
    if (isConnectedToHome(state)) {
        return feedWidth;
    }
    return getNodeFeatures(state)?.feedWidth ?? feedWidth;
}
