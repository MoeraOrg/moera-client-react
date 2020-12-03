import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import { isAtHomeNode } from "state/node/selectors";
import { isAtTimelinePage } from "state/navigation/selectors";
import Jump from "ui/navigation/Jump";
import "./HomeButton.css";

const HomeButton = ({atHomeTimeline}) => (
    <Jump nodeName=":" href="/" className={cx("connection-button", "home-button", {"active": atHomeTimeline})}
          title={"Your timeline"}>
        <FontAwesomeIcon icon="home"/>
    </Jump>
);

export default connect(
    state => ({
        atHomeTimeline: isAtHomeNode(state) && isAtTimelinePage(state),
    })
)(HomeButton);
