import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, withFormik } from 'formik';
import * as textFieldEdit from 'text-field-edit';

import { closeCommentDialog, commentDialogConflictClose, commentPost } from "state/detailedposting/actions";
import { getSetting } from "state/settings/selectors";
import { getHomeOwnerAvatar, getHomeOwnerFullName, getHomeOwnerName } from "state/home/selectors";
import { getCommentComposerComment, isCommentComposerConflict } from "state/detailedposting/selectors";
import { Browser } from "ui/browser";
import { Button, ConflictWarning, ModalDialog } from "ui/control";
import NodeName from "ui/nodename/NodeName";
import { AvatarField, RichTextField } from "ui/control/field";
import commentComposeLogic from "ui/comment/comment-compose-logic";
import { parseBool } from "util/misc";
import "./CommentDialog.css";

function CommentDialog(props) {
    const {
        comment, show, ownerName, ownerFullName, conflict, beingPosted, smileysEnabled, sourceFormatDefault,
        closeCommentDialog, commentDialogConflictClose, submitKey, submitForm, resetForm
    } = props;

    const commentId = comment != null ? comment.id : null;
    useEffect(() => {
        const values = commentComposeLogic.mapPropsToValues(props);
        resetForm({values});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, commentId]); // 'props' are missing on purpose

    const onKeyDown = event => {
        if (event.key === "Enter") {
            const submit = !Browser.isTouchScreen() && !event.shiftKey
                && ((submitKey === "enter" && !event.ctrlKey) || (submitKey === "ctrl-enter" && event.ctrlKey));
            if (submit) {
                submitForm();
            } else {
                textFieldEdit.insert(event.target, "\n");
            }
            event.preventDefault();
        }
    }

    if (!show) {
        return null;
    }

    return (
        <ModalDialog title="Edit a comment" className="comment-dialog" onClose={closeCommentDialog}>
            <ConflictWarning text="The comment was edited by somebody." show={conflict}
                             onClose={commentDialogConflictClose}/>
            <Form>
                <div className="modal-body">
                    <div className="owner-line">
                        <AvatarField name="avatar" size={36}/>
                        <NodeName name={ownerName} fullName={ownerFullName} linked={false}/>
                    </div>
                    <RichTextField name="body" rows={5} anyValue autoFocus disabled={beingPosted}
                                   smileysEnabled={smileysEnabled} format={sourceFormatDefault}
                                   onKeyDown={onKeyDown}/>
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={closeCommentDialog}>Cancel</Button>
                    <Button variant="primary" type="submit" loading={beingPosted}>Update</Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

export default connect(
    state => ({
        show: state.detailedPosting.compose.showDialog,
        ownerName: getHomeOwnerName(state),
        ownerFullName: getHomeOwnerFullName(state),
        avatarDefault: getHomeOwnerAvatar(state),
        receiverPostingId: state.detailedPosting.comments.receiverPostingId,
        comment: getCommentComposerComment(state),
        conflict: isCommentComposerConflict(state),
        reactionsPositiveDefault: getSetting(state, "comment.reactions.positive.default"),
        reactionsNegativeDefault: getSetting(state, "comment.reactions.negative.default"),
        sourceFormatDefault: getSetting(state, "comment.body-src-format.default"),
        beingPosted: state.detailedPosting.compose.beingPosted,
        submitKey: getSetting(state, "comment.submit-key"),
        smileysEnabled: parseBool(getSetting(state, "comment.smileys.enabled"))
    }),
    { commentPost, closeCommentDialog, commentDialogConflictClose }
)(withFormik(commentComposeLogic)(CommentDialog));
