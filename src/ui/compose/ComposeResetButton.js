import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button } from "ui/control";
import { composeDraftListItemDelete, composeDraftRevisionDelete } from "state/compose/actions";
import { confirmBox } from "state/confirmbox/actions";
import "./ComposeResetButton.css";

function ComposeResetButton({postingId, draftId, posting, confirmBox}) {
    if (draftId == null) {
        return null;
    }

    const onClick = () => {
        if (postingId == null) {
            confirmBox("Do you really want to delete the draft?", "Yes", "No",
                composeDraftListItemDelete(draftId));
        } else {
            confirmBox("Do you really want to forget all changes?", "Yes", "No",
                composeDraftRevisionDelete());
        }
    };

    if (postingId == null) {
        return (
            <Button variant="danger" className="reset-button" title="Delete draft" onClick={onClick}>
                <FontAwesomeIcon icon="trash-alt"/>
            </Button>
        );
    } else {
        if (posting == null) {
            return null;
        }
        return (
            <Button variant="info" className="reset-button" onClick={onClick}>
                <FontAwesomeIcon icon="undo-alt"/>
                {" "}Undo
            </Button>
        );
    }
}

export default connect(
    state => ({
        postingId: state.compose.postingId,
        draftId: state.compose.draftId,
        posting: state.compose.posting
    }),
    { confirmBox }
)(ComposeResetButton);
