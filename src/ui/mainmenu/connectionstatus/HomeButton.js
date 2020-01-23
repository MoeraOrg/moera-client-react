import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { isAtHomeNode } from "state/node/selectors";

const HomeButton = ({location, atHome}) => (
    atHome ?
        <span className="connection-button active" title="You are at your home node">
            <FontAwesomeIcon icon="home"/>
        </span>
    :
        <a href={location} className="connection-button" title="Home node"><FontAwesomeIcon icon="home"/></a>
);

export default connect(
    state => ({
        location: state.home.root.location,
        atHome: isAtHomeNode(state),
    })
)(HomeButton);
