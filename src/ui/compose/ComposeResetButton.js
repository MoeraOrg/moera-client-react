import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button } from "ui/control";
import { composeDraftListItemDelete, composeDraftRevisionDelete } from "state/compose/actions";
import { confirmBox } from "state/confirmbox/actions";
import "./ComposeResetButton.css";

function ComposeResetButton({postingId, draftId, posting, confirmBox}) {
    const onClick = useCallback(() => {
        if (postingId == null) {
            confirmBox("Do you really want to delete the draft?", "Yes", "No",
                composeDraftListItemDelete(draftId));
        } else {
            confirmBox("Do you really want to forget all changes?", "Yes", "No",
                composeDraftRevisionDelete());
        }
    }, [postingId, draftId, confirmBox]);

    if (postingId == null) {
        if (draftId == null) {
            return null;
        }
        return (
            <Button variant="danger" className="reset-button" title="Delete draft" onClick={onClick}>
                <FontAwesomeIcon icon="trash-alt"/>
            </Button>
        );
    } else {
        if (posting == null || !posting.draftPending) {
            return null;
        }
        return (
            <Button variant="info" className="reset-button" onClick={this.onClick}>
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
