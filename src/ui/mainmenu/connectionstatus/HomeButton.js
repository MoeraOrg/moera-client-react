import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import { isAtHomeNode } from "state/node/selectors";
import Jump from "ui/navigation/Jump";
import "./HomeButton.css";

const HomeButton = ({atHome}) => (
    <Jump nodeName=":" href="/" className={cx("connection-button", "home-button", {"active": atHome})}
          title={atHome ? "Home node" : "You are at your home node"}>
        <FontAwesomeIcon icon="home"/>
    </Jump>
);

export default connect(
    state => ({
        atHome: isAtHomeNode(state),
    })
)(HomeButton);
