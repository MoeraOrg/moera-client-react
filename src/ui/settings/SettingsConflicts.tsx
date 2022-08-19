import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
    settingsClientConflictClose,
    settingsNodeConflictClose,
    settingsPluginsConflictClose
} from "state/settings/actions";
import { ClientState } from "state/state";
import { ConflictWarning } from "ui/control";

type Props = ConnectedProps<typeof connector>;

const SettingsConflicts = ({tab, nodeConflict, clientConflict, pluginsConflict,
                            settingsNodeConflictClose, settingsClientConflictClose,
                            settingsPluginsConflictClose}: Props) => (
    <>
        {tab === "node" &&
            <ConflictWarning text="Node settings were changed by somebody." show={nodeConflict}
                             onClose={settingsNodeConflictClose}/>
        }
        {tab === "client" &&
            <ConflictWarning text="Client settings were changed by somebody." show={clientConflict}
                             onClose={settingsClientConflictClose}/>
        }
        {tab === "node" &&
            <ConflictWarning text="List of plugins has been changed." show={pluginsConflict}
                             onClose={settingsPluginsConflictClose}/>
        }
    </>
);

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
