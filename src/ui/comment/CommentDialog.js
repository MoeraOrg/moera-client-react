import React from 'react';
import { connect } from 'react-redux';
import { Form, withFormik } from 'formik';
import * as textFieldEdit from 'text-field-edit';

import { Button, ConflictWarning, ModalDialog } from "ui/control";
import { TextField } from "ui/control/field";
import { closeCommentDialog, commentDialogConflictClose, commentPost } from "state/detailedposting/actions";
import commentComposeLogic from "ui/comment/comment-compose-logic";
import { getSetting } from "state/settings/selectors";
import { getHomeOwnerName } from "state/home/selectors";
import { getCommentComposerComment, isCommentComposerConflict } from "state/detailedposting/selectors";

class CommentDialog extends React.PureComponent {

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((this.props.show && !prevProps.show)
            || (this.props.comment != null && prevProps.comment == null)
            || (this.props.comment != null && this.props.comment.id !== prevProps.comment.id)) {

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
        const {show, conflict, beingPosted, closeCommentDialog, commentDialogConflictClose} = this.props;

        if (!show) {
            return null;
        }

        return (
            <ModalDialog title="Edit a comment" onClose={closeCommentDialog}>
                <ConflictWarning text="The comment was edited by somebody." show={conflict}
                                 onClose={commentDialogConflictClose}/>
                <Form>
                    <div className="modal-body">
                        <TextField name="body" rows={5} anyValue autoFocus disabled={beingPosted}
                                   onKeyDown={this.onKeyDown}/>
                    </div>
                    <div className="modal-footer">
                        <Button variant="secondary" onClick={closeCommentDialog}>Cancel</Button>
                        <Button variant="primary" type="submit" loading={beingPosted}>Update</Button>
                    </div>
                </Form>
            </ModalDialog>
        );
    }

}

export default connect(
    state => ({
        show: state.detailedPosting.compose.showDialog,
        ownerName: getHomeOwnerName(state),
        receiverPostingId: state.detailedPosting.comments.receiverPostingId,
        comment: getCommentComposerComment(state),
        conflict: isCommentComposerConflict(state),
        reactionsPositiveDefault: getSetting(state, "comment.reactions.positive.default"),
        reactionsNegativeDefault: getSetting(state, "comment.reactions.negative.default"),
        sourceFormatDefault: getSetting(state, "comment.body-src-format.default"),
        beingPosted: state.detailedPosting.compose.beingPosted,
        submitKey: getSetting(state, "comment.submit-key")
    }),
    { commentPost, closeCommentDialog, commentDialogConflictClose }
)(withFormik(commentComposeLogic)(CommentDialog));
