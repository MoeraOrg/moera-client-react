import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { isAtComposePage } from "state/navigation/selectors";
import Jump from "ui/navigation/Jump";
import "./NewPostButton.css";

const NewPostButton = ({atCompose}) => (
    !atCompose &&
        <Jump nodeName=":" href="/compose" className="btn btn-success btn-sm new-post-button">
            <FontAwesomeIcon icon="pen-alt"/>
            &nbsp;&nbsp;New post
        </Jump>
);

export default connect(
    state => ({
        atCompose: isAtComposePage(state)
    })
)(NewPostButton);
