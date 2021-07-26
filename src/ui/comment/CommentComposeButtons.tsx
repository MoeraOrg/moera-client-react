import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useField } from 'formik';

import { Button } from "ui/control";
import { commentComposeUnset } from "state/detailedposting/actions";
import { confirmBox } from "state/confirmbox/actions";
import "./CommentComposeButtons.css";

type Props = {
    loading: boolean;
} & ConnectedProps<typeof connector>;

function CommentComposeButtons({loading, confirmBox}: Props) {
    const onCancel = (e: React.MouseEvent) => {
        confirmBox("Do you really want to forget the unfinished comment?", "Forget", "Cancel",
            commentComposeUnset(), null, "danger");
        e.preventDefault();
    };

    const [, {value: body}] = useField("body");
    const invisible = body.trim().length === 0;

    return (
        <div className="buttons">
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
    null,
    { confirmBox }
);

export default connector(CommentComposeButtons);
