import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getHomeOwnerName } from "state/home/selectors";
import { isAtComposePage } from "state/navigation/selectors";
import Jump from "ui/navigation/Jump";
import "./NewPostButton.css";

const NewPostButton = ({homeOwnerName, atCompose}) => (
    !atCompose &&
        <Jump nodeName={homeOwnerName} href="/compose" className="btn btn-success btn-sm new-post-button">
            <FontAwesomeIcon icon="pen-alt"/>
            &nbsp;&nbsp;New post
        </Jump>
);

export default connect(
    state => ({
        homeOwnerName: getHomeOwnerName(state),
        atCompose: isAtComposePage(state)
    })
)(NewPostButton);
