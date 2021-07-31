import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ConflictWarning } from "ui/control";
import { settingsClientConflictClose, settingsNodeConflictClose } from "state/settings/actions";
import { ClientState } from "state/state";

type Props = ConnectedProps<typeof connector>;

const SettingsConflicts = ({tab, nodeConflict, clientConflict,
                            settingsNodeConflictClose, settingsClientConflictClose}: Props) => (
    <>
        {tab === "node" &&
            <ConflictWarning text="Node settings were changed by somebody." show={nodeConflict}
                             onClose={settingsNodeConflictClose}/>
        }
        {tab === "client" &&
            <ConflictWarning text="Client settings were changed by somebody." show={clientConflict}
                             onClose={settingsClientConflictClose}/>
        }
    </>
);

const connector = connect(
    (state: ClientState) => ({
        tab: state.settings.tab,
        nodeConflict: state.settings.node.conflict,
        clientConflict: state.settings.client.conflict
    }),
    { settingsNodeConflictClose, settingsClientConflictClose }
);

export default connector(SettingsConflicts);
