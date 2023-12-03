import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import {
    settingsClientConflictClose,
    settingsNodeConflictClose,
    settingsPluginsConflictClose
} from "state/settings/actions";
import { ConflictWarning } from "ui/control";

export default function SettingsConflicts() {
    const tab = useSelector((state: ClientState) => state.settings.tab);
    const nodeConflict = useSelector((state: ClientState) => state.settings.node.conflict);
    const clientConflict = useSelector((state: ClientState) => state.settings.client.conflict);
    const pluginsConflict = useSelector((state: ClientState) => state.settings.plugins.conflict);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    return (
        <>
            {(tab === "node" && nodeConflict) &&
                <ConflictWarning text={t("node-settings-changed-conflict")}
                                 onClose={() => dispatch(settingsNodeConflictClose())}/>
            }
            {(tab === "client" && clientConflict) &&
                <ConflictWarning text={t("client-settings-changed-conflict")}
                                 onClose={() => dispatch(settingsClientConflictClose())}/>
            }
            {(tab === "node" && pluginsConflict) &&
                <ConflictWarning text={t("addons-changed-conflict")}
                                 onClose={() => dispatch(settingsPluginsConflictClose())}/>
            }
        </>
    );
}
