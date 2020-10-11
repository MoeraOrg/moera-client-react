import React from 'react';
import { connect } from 'react-redux';
import { connect as connectFormik } from 'formik';

import { Button } from "ui/control";
import { commentComposeUnset } from "state/detailedposting/actions";
import { confirmBox } from "state/confirmbox/actions";
import "./CommentComposeButtons.css";

class CommentComposeButtons extends React.PureComponent {

    onCancel = e => {
        const {confirmBox} = this.props;

        confirmBox("Do you really want to forget the unfinished comment?", "Forget", "Cancel",
            commentComposeUnset(), null, "danger");
        e.preventDefault();
    }

    render() {
        const {loading, formik} = this.props;
        const invisible = formik.values["body"].trim().length === 0;
        return (
            <div className="buttons">
                <Button variant="secondary" invisible={invisible} onClick={this.onCancel}>
                    CANCEL
                </Button>
                <Button variant="primary" type="submit" loading={loading} invisible={invisible}>
                    ADD COMMENT
                </Button>
            </div>
        );
    }

}

export default connect(
    null,
    { confirmBox }
)(connectFormik(CommentComposeButtons));
