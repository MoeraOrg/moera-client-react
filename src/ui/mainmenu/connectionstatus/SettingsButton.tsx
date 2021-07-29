import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { isAtSettingsPage } from "state/navigation/selectors";
import Jump from "ui/navigation/Jump";
import { ClientState } from "state/state";

type Props = ConnectedProps<typeof connector>;

const SettingsButton = ({atSettings}: Props) => (
    atSettings ?
        <span className="connection-button active" title="Settings"><FontAwesomeIcon icon="cog"/></span>
    :
        <Jump nodeName=":" href="/settings" className="connection-button" title="Settings">
            <FontAwesomeIcon icon="cog"/>
        </Jump>
);

const connector = connect(
    (state: ClientState) => ({
        atSettings: isAtSettingsPage(state),
    })
);

export default connector(SettingsButton);
