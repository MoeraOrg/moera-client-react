import { ClientSettingMetaInfo, GrantInfo, PluginInfo, SettingMetaInfo, TokenInfo } from "api";

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
    formId: number;
    updating: boolean;
    changePasswordDialogShow: boolean;
    changingPassword: boolean;
    grants: {
        loading: boolean;
        loaded: boolean;
        grants: GrantInfo[];
        dialog: {
            show: boolean;
            nodeName: string;
            grant: GrantInfo | null;
            updating: boolean;
        }
    },
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
    },
    deleteNode: {
        loading: boolean;
        loaded: boolean;
        requested: boolean;
        updating: boolean;
    }
}
