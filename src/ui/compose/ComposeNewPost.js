import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { useFormikContext } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import composePageLogic from "ui/compose/compose-page-logic";
import { composeDraftSelect } from "state/compose/actions";
import "./ComposeNewPost.css";

function postingText(values, props) {
    return composePageLogic.mapValuesToPostingText(values, props);
}

function isEmpty(postingText) {
    return composePageLogic.isPostingTextEmpty(postingText);
}

function ComposeNewPost(props) {
    const {postingId, composeDraftSelect} = props;
    const {values} = useFormikContext();

    const onClick = useCallback(() => composeDraftSelect(null), [composeDraftSelect]);

    if (postingId != null || isEmpty(postingText(values, props))) {
        return null;
    }
    return (
        <div className="dropdown-item new-post" onClick={onClick}>
            <FontAwesomeIcon icon="pen-alt"/>
            &nbsp;&nbsp;New post
        </div>
    );
}

export default connect(
    state => ({
        subjectPresent: state.compose.subjectPresent,
        postingId: state.compose.postingId,
        posting: state.compose.posting
    }),
    { composeDraftSelect }
)(ComposeNewPost);
