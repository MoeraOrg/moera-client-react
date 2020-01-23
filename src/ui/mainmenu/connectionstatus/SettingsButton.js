import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { isAtSettingsPage } from "state/navigation/selectors";
import { goToSettingsWithDefaultSubpage } from "state/navigation/actions";

const SettingsButton = ({rootPage, atSettings, goToSettingsWithDefaultSubpage}) => (
    atSettings ?
        <span className="connection-button active" title="Settings"><FontAwesomeIcon icon="cog"/></span>
    :
        <a href={rootPage + "/settings"}
           className="connection-button"
           title="Settings"
           onClick={event => {
              goToSettingsWithDefaultSubpage();
              event.preventDefault();
        }}><FontAwesomeIcon icon="cog"/></a>
);

export default connect(
    state => ({
        rootPage: state.node.root.page,
        atSettings: isAtSettingsPage(state),
    }),
    { goToSettingsWithDefaultSubpage }
)(SettingsButton);
