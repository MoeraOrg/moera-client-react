import React from 'react';
import { connect } from 'react-redux';
import { connect as connectFormik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import composePageLogic from "ui/compose/compose-page-logic";
import { composeDraftSelect } from "state/compose/actions";
import "./ComposeNewPost.css";

function postingText(props) {
    return composePageLogic.mapValuesToPostingText(props.formik.values, props);
}

function isEmpty(postingText) {
    return composePageLogic.isPostingTextEmpty(postingText);
}

class ComposeNewPost extends React.PureComponent {

    onClick = () => {
        this.props.composeDraftSelect(null);
    };

    render() {
        if (this.props.postingId != null || isEmpty(postingText(this.props))) {
            return null;
        }
        return (
            <div className="dropdown-item new-post" onClick={this.onClick}>
                <FontAwesomeIcon icon="pen-alt"/>
                &nbsp;&nbsp;New post
            </div>
        );
    }

}

export default connectFormik(
    connect(
        state => ({
            subjectPresent: state.compose.subjectPresent,
            postingId: state.compose.postingId,
            posting: state.compose.posting
        }),
        { composeDraftSelect }
    )(ComposeNewPost)
);
