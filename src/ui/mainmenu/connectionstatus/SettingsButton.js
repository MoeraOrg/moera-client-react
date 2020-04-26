import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { isAtSettingsPage } from "state/navigation/selectors";
import Jump from "ui/navigation/Jump";

const SettingsButton = ({atSettings}) => (
    atSettings ?
        <span className="connection-button active" title="Settings"><FontAwesomeIcon icon="cog"/></span>
    :
        <Jump href="/settings" className="connection-button" title="Settings"><FontAwesomeIcon icon="cog"/></Jump>
);

export default connect(
    state => ({
        atSettings: isAtSettingsPage(state),
    })
)(SettingsButton);
