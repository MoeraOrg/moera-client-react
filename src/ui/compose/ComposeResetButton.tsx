import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button } from "ui/control";
import { ClientState } from "state/state";
import { composeDraftListItemDelete, composeUpdateDraftDelete } from "state/compose/actions";
import { confirmBox } from "state/confirmbox/actions";
import "./ComposeResetButton.css";

type Props = ConnectedProps<typeof connector>;

function ComposeResetButton({postingId, draftId, confirmBox}: Props) {
    if (draftId == null) {
        return null;
    }

    const onClick = () => {
        if (postingId == null) {
            confirmBox("Do you really want to delete the draft?", "Yes", "No",
                composeDraftListItemDelete(draftId));
        } else {
            confirmBox("Do you really want to forget all changes?", "Yes", "No",
                composeUpdateDraftDelete());
        }
    };

    if (postingId == null) {
        return (
            <Button variant="danger" className="reset-button" title="Delete draft" onClick={onClick}>
                <FontAwesomeIcon icon="trash-alt"/>
            </Button>
        );
    } else {
        return (
            <Button variant="info" className="reset-button" onClick={onClick}>
                <FontAwesomeIcon icon="undo-alt"/>
                {" "}Undo
            </Button>
        );
    }
}

const connector = connect(
    (state: ClientState) => ({
        postingId: state.compose.postingId,
        draftId: state.compose.draftId
    }),
    { confirmBox }
);

export default connector(ComposeResetButton);
