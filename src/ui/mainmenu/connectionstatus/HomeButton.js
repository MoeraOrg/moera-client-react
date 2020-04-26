import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { isAtHomeNode } from "state/node/selectors";
import Jump from "ui/navigation/Jump";

const HomeButton = ({atHome}) => (
    atHome ?
        <span className="connection-button active" title="You are at your home node">
            <FontAwesomeIcon icon="home"/>
        </span>
    :
        <Jump nodeName=":" href="/" className="connection-button" title="Home node">
            <FontAwesomeIcon icon="home"/>
        </Jump>
);

export default connect(
    state => ({
        atHome: isAtHomeNode(state),
    })
)(HomeButton);
