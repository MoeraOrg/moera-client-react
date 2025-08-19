import { CLIENT_SETTINGS_PREFIX, ClientSettingMetaInfo, SettingMetaInfo, SettingTypes, SettingValue } from "api";
import { ClientState } from "state/state";
import { isConnectedToHome } from "state/home/selectors";
import { getNodeFeatures } from "state/node/selectors";

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

export function isSettingsNodeLoaded(state: ClientState): boolean {
    return state.settings.node.loadedMeta && state.settings.node.loadedValues;
}

export function isSettingsClientValuesToBeLoaded(state: ClientState): boolean {
    return !state.settings.client.loadedValues && !state.settings.client.loadingValues;
}

export function isSettingsClientValuesLoaded(state: ClientState): boolean {
    return state.settings.client.loadedValues;
}

export function isSettingsAtSecuritySheet(state: ClientState): boolean {
    return state.settings.tab === "node" && state.settings.sheet === "security";
}

export function isSettingsAtApplicationsSheet(state: ClientState): boolean {
    return state.settings.tab === "node" && state.settings.sheet === "applications";
}

export function isSettingsAtAddonsSheet(state: ClientState): boolean {
    return state.settings.tab === "node" && state.settings.sheet === "addons";
}

export function isSettingsAtRemovalSheet(state: ClientState): boolean {
    return state.settings.tab === "node" && state.settings.sheet === "removal";
}

export function isSettingsAtProfileSheet(state: ClientState): boolean {
    return state.settings.tab === "profile" && state.settings.sheet === "profile";
}

export function isSettingsGrantsToBeLoaded(state: ClientState): boolean {
    return !state.settings.grants.loaded && !state.settings.grants.loading;
}

export function isSettingsTokensToBeLoaded(state: ClientState): boolean {
    return !state.settings.tokens.loaded && !state.settings.tokens.loading;
}

export function isSettingsPluginsToBeLoaded(state: ClientState): boolean {
    return !state.settings.plugins.loaded && !state.settings.plugins.loading;
}

export function isSettingsPluginsLoaded(state: ClientState): boolean {
    return state.settings.plugins.loaded;
}

export function isSettingsDeleteNodeRequestToBeLoaded(state: ClientState): boolean {
    return !state.settings.deleteNode.loaded && !state.settings.deleteNode.loading;
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
    return SettingTypes.toValueMemoized(name, meta.type, value ?? meta.defaultValue ?? "");
}

export function getSettingMeta(state: ClientState, name: string): ClientSettingMetaInfo | null {
    return state.settings.client.meta.get(CLIENT_SETTINGS_PREFIX + name) ?? null;
}

export function getSetting(state: ClientState, name: string): SettingValue | null {
    const meta = getSettingMeta(state, name);
    if (!meta) {
        return null;
    }
    const value = state.settings.client.values.get(CLIENT_SETTINGS_PREFIX + name);
    return SettingTypes.toValueMemoized(CLIENT_SETTINGS_PREFIX + name, meta.type, value ?? meta.defaultValue ?? "");
}

export function getFeedWidth(state: ClientState): number {
    const feedWidth = getSetting(state, "feed.width") as number;
    if (isConnectedToHome(state)) {
        return feedWidth;
    }
    return getNodeFeatures(state)?.feedWidth ?? feedWidth;
}
