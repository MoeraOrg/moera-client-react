import React from 'react';
import { connect } from 'react-redux';

import { ConflictWarning } from "ui/control";
import { settingsClientConflictClose, settingsNodeConflictClose } from "state/settings/actions";

const SettingsConflicts = ({tab, nodeConflict, clientConflict,
                            settingsNodeConflictClose, settingsClientConflictClose}) => (
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

export default connect(
    state => ({
        tab: state.settings.tab,
        nodeConflict: state.settings.node.conflict,
        clientConflict: state.settings.client.conflict
    }),
    { settingsNodeConflictClose, settingsClientConflictClose }
)(SettingsConflicts);
