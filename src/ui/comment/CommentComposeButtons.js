import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { useField } from 'formik';

import { Button } from "ui/control";
import { commentComposeUnset } from "state/detailedposting/actions";
import { confirmBox } from "state/confirmbox/actions";
import "./CommentComposeButtons.css";

function CommentComposeButtons({loading, confirmBox}) {
    const onCancel = useCallback(e => {
        confirmBox("Do you really want to forget the unfinished comment?", "Forget", "Cancel",
            commentComposeUnset(), null, "danger");
        e.preventDefault();
    }, [confirmBox]);

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

export default connect(
    null,
    { confirmBox }
)(CommentComposeButtons);
