import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { isAtComposePage } from "state/navigation/selectors";
import { isAtHomeNode } from "state/node/selectors";
import { goToCompose } from "state/navigation/actions";
import "./NewPostButton.css";

const NewPostButton = ({rootPage, atCompose, atHome, goToCompose}) => (
    !atCompose &&
        <a href={rootPage + "/compose"}
           className="btn btn-success btn-sm new-post-button"
           onClick={event => {
               if (atHome) {
                   goToCompose();
                   event.preventDefault();
               }
        }}>
            <FontAwesomeIcon icon="pen-alt"/>
            &nbsp;&nbsp;New post
        </a>
);

export default connect(
    state => ({
        rootPage: state.home.root.page,
        atCompose: isAtComposePage(state),
        atHome: isAtHomeNode(state)
    }),
    { goToCompose }
)(NewPostButton);
