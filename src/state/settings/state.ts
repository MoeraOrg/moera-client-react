import { PluginInfo, SettingMetaInfo, TokenInfo } from "api/node/api-types";
import { ClientSettingMetaInfo } from "api/settings";

export type SettingsTabId = "node" | "client";

export interface SettingsState {
    tab: SettingsTabId;
    sheet: string;
    node: {
        loadingValues: boolean;
        loadedValues: boolean;
        conflict: boolean;
        values: Map<string, string | null>;
        loadingMeta: boolean;
        loadedMeta: boolean;
        meta: Map<string, SettingMetaInfo>;
    },
    client: {
        loadingValues: boolean;
        loadedValues: boolean;
        conflict: boolean;
        values: Map<string, string | null>;
        meta: Map<string, ClientSettingMetaInfo>;
    },
    updating: boolean;
    changePasswordDialogShow: boolean;
    changingPassword: boolean;
    tokens: {
        loading: boolean;
        loaded: boolean;
        tokens: TokenInfo[];
        dialog: {
            show: boolean;
            token: TokenInfo | null;
            updating: boolean;
            newToken: TokenInfo | null;
        }
    },
    plugins: {
        loading: boolean;
        loaded: boolean;
        conflict: boolean;
        plugins: PluginInfo[];
    }
}
