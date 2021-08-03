import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useField } from 'formik';

import { CommentText } from "api/node/api-types";
import { commentComposeUnset } from "state/detailedposting/actions";
import { confirmBox } from "state/confirmbox/actions";
import { getOwnerName } from "state/owner/selectors";
import { ClientState } from "state/state";
import { Button } from "ui/control";
import CommentDraftSaver from "ui/comment/CommentDraftSaver";
import "./CommentComposeButtons.css";

type Props = {
    loading: boolean;
} & ConnectedProps<typeof connector>;

function CommentComposeButtons({loading, confirmBox}: Props) {
    const [initialText, setInitialText] = useState<CommentText>({ownerName: "", bodySrc: ""});

    const onCancel = (e: React.MouseEvent) => {
        confirmBox("Do you really want to forget the unfinished comment?", "Forget", "Cancel",
            commentComposeUnset(), null, "danger");
        e.preventDefault();
    };

    const [, {value: body}] = useField("body");
    const invisible = body.trim().length === 0;

    return (
        <div className="buttons">
            <CommentDraftSaver initialText={initialText} commentId={null}/>
            <Button variant="secondary" invisible={invisible} onClick={onCancel}>
                CANCEL
            </Button>
            <Button variant="primary" type="submit" loading={loading} invisible={invisible}>
                ADD COMMENT
            </Button>
        </div>
    );
}

const connector = connect(
    (state: ClientState) => ({
        ownerName: getOwnerName(state)
    }),
    { confirmBox }
);

export default connector(CommentComposeButtons);
