import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import {
    settingsClientConflictClose,
    settingsNodeConflictClose,
    settingsPluginsConflictClose
} from "state/settings/actions";
import { ConflictWarning } from "ui/control";

type Props = ConnectedProps<typeof connector>;

const SettingsConflicts = ({tab, nodeConflict, clientConflict, pluginsConflict,
                            settingsNodeConflictClose, settingsClientConflictClose,
                            settingsPluginsConflictClose}: Props) => {
    const {t} = useTranslation();

    return (
        <>
            {(tab === "node" && nodeConflict) &&
                <ConflictWarning text={t("node-settings-changed-conflict")} onClose={settingsNodeConflictClose}/>
            }
            {(tab === "client" && clientConflict) &&
                <ConflictWarning text={t("client-settings-changed-conflict")} onClose={settingsClientConflictClose}/>
            }
            {(tab === "node" && pluginsConflict) &&
                <ConflictWarning text={t("addons-changed-conflict")} onClose={settingsPluginsConflictClose}/>
            }
        </>
    );
}

const connector = connect(
    (state: ClientState) => ({
        tab: state.settings.tab,
        nodeConflict: state.settings.node.conflict,
        clientConflict: state.settings.client.conflict,
        pluginsConflict: state.settings.plugins.conflict
    }),
    { settingsNodeConflictClose, settingsClientConflictClose, settingsPluginsConflictClose }
);

export default connector(SettingsConflicts);
