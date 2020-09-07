import React from 'react';
import { connect } from 'react-redux';
import { Form, withFormik } from 'formik';
import * as textFieldEdit from 'text-field-edit'

import { getSetting } from "state/settings/selectors";
import { commentPost } from "state/detailedposting/actions";
import { getHomeOwnerName } from "state/home/selectors";
import { getCommentComposerRepliedToId } from "state/detailedposting/selectors";
import { TextField } from "ui/control/field";
import CommentComposeRepliedTo from "ui/comment/CommentComposeRepliedTo";
import CommentSubmitButton from "ui/comment/CommentSubmitButton";
import commentComposeLogic from "ui/comment/comment-compose-logic";
import "./CommentCompose.css";

class CommentCompose extends React.PureComponent {

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.receiverName !== prevProps.receiverName
            || this.props.receiverPostingId !== prevProps.receiverPostingId
            || this.props.formId !== prevProps.formId) {

            const values = commentComposeLogic.mapPropsToValues(this.props);
            this.props.resetForm({values});
        }
    }

    onKeyDown = (event) => {
        const {submitKey, submitForm} = this.props;

        if (event.key === "Enter") {
            const submit = (submitKey === "enter" && !event.ctrlKey) || (submitKey === "ctrl-enter" && event.ctrlKey);
            if (submit) {
                submitForm();
            } else {
                textFieldEdit.insert(event.target, "\n");
            }
            event.preventDefault();
        }
    }

    render() {
        const {ownerName, beingPosted} = this.props;

        if (!ownerName) {
            return null;
        }
        return (
            <div id="comment-composer">
                <Form>
                    <div className="content">
                        <CommentComposeRepliedTo/>
                        <TextField name="body" rows={1} placeholder="Write a comment here..." anyValue
                                   disabled={beingPosted} onKeyDown={this.onKeyDown}/>
                    </div>
                    <CommentSubmitButton loading={beingPosted}/>
                </Form>
            </div>
        );
    }

}

export default connect(
    state => ({
        ownerName: getHomeOwnerName(state),
        receiverName: state.detailedPosting.comments.receiverName,
        receiverPostingId: state.detailedPosting.comments.receiverPostingId,
        formId: state.detailedPosting.compose.formId,
        repliedToId: getCommentComposerRepliedToId(state),
        beingPosted: state.detailedPosting.compose.beingPosted,
        reactionsPositiveDefault: getSetting(state, "comment.reactions.positive.default"),
        reactionsNegativeDefault: getSetting(state, "comment.reactions.negative.default"),
        sourceFormatDefault: getSetting(state, "comment.body-src-format.default"),
        submitKey: getSetting(state, "comment.submit-key")
    }),
    { commentPost }
)(withFormik(commentComposeLogic)(CommentCompose));
