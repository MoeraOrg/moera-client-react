import { SettingMetaInfo } from "api/node/api-types";
import { ClientSettingMetaInfo } from "api/settings";

export interface SettingsState {
    tab: string;
    sheet: string;
    node: {
        loadingValues: boolean;
        loadedValues: boolean;
        conflict: boolean;
        values: Map<string, string>;
        loadingMeta: boolean;
        loadedMeta: boolean;
        meta: Map<string, SettingMetaInfo>;
    },
    client: {
        loadingValues: boolean;
        loadedValues: boolean;
        conflict: boolean;
        values: Map<string, string>;
        meta: Map<string, ClientSettingMetaInfo>;
    },
    updating: boolean;
    changePasswordDialogShow: boolean;
    changingPassword: boolean;
}
