import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikProps, withFormik, WithFormikConfig } from 'formik';
import * as textFieldEdit from 'text-field-edit';

import { CommentText, SourceFormat } from "api/node/api-types";
import { ClientState } from "state/state";
import {
    cancelCommentDialog,
    closeCommentDialog,
    commentDialogConflictClose,
    commentPost
} from "state/detailedposting/actions";
import { getSetting } from "state/settings/selectors";
import { getHomeOwnerAvatar, getHomeOwnerFullName, getHomeOwnerName } from "state/home/selectors";
import { getCommentDialogComment, isCommentDialogConflict } from "state/detailedposting/selectors";
import { confirmBox } from "state/confirmbox/actions";
import { Browser } from "ui/browser";
import { Button, ConflictWarning, ModalDialog } from "ui/control";
import NodeName from "ui/nodename/NodeName";
import { AvatarField, RichTextField } from "ui/control/field";
import commentComposeLogic, { CommentComposeValues } from "ui/comment/comment-compose-logic";
import CommentDraftSaver from "ui/comment/CommentDraftSaver";
import "./CommentDialog.css";

type OuterProps = ConnectedProps<typeof connector>;

type Props = OuterProps & FormikProps<CommentComposeValues>;

function CommentDialog(props: Props) {
    const {
        show, ownerName, ownerFullName, comment, draft, conflict, loading, beingPosted, smileysEnabled,
        sourceFormatDefault, closeCommentDialog, commentDialogConflictClose, confirmBox, submitKey, submitForm,
        resetForm
    } = props;

    const commentId = comment != null ? comment.id : null;

    const [initialText, setInitialText] = useState<CommentText>({ownerName: "", bodySrc: ""});

    useEffect(() => {
        const values = commentComposeLogic.mapPropsToValues(props);
        const commentText = commentComposeLogic.mapValuesToCommentText(values, props);
        if (commentText != null) {
            setInitialText(commentText);
        }
        resetForm({values});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, commentId, draft, setInitialText]); // 'props' are missing on purpose

    if (!show) {
        return null;
    }

    const onKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            const submit = !Browser.isTouchScreen() && !event.shiftKey
                && ((submitKey === "enter" && !event.ctrlKey) || (submitKey === "ctrl-enter" && event.ctrlKey));
            if (submit) {
                submitForm();
            } else {
                textFieldEdit.insert(event.target as HTMLTextAreaElement, "\n");
            }
            event.preventDefault();
        }
    }

    const onCancel = (event: React.MouseEvent) => {
        if (draft == null) {
            closeCommentDialog();
        } else {
            confirmBox("Do you really want to forget the changes?", "Forget", "Cancel",
                cancelCommentDialog(draft.id), null, "danger");
        }
        event.preventDefault();
    };

    return (
        <ModalDialog title="Edit a comment" className="comment-dialog" onClose={closeCommentDialog}>
            <ConflictWarning text="The comment was edited by somebody." show={conflict}
                             onClose={commentDialogConflictClose}/>
            <Form>
                <div className="modal-body">
                    <div className="owner-line">
                        <AvatarField name="avatar" size={36}/>
                        <NodeName name={ownerName} fullName={ownerFullName} linked={false} popup={false}/>
                    </div>
                    <RichTextField name="body" rows={5} anyValue autoFocus disabled={loading || beingPosted}
                                   smileysEnabled={smileysEnabled} format={sourceFormatDefault}
                                   onKeyDown={onKeyDown}/>
                </div>
                <div className="modal-footer">
                    <CommentDraftSaver initialText={initialText} commentId={commentId}/>
                    <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                    <Button variant="primary" type="submit" loading={beingPosted}>Update</Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

const connector = connect(
    (state: ClientState) => ({
        show: state.detailedPosting.commentDialog.show,
        ownerName: getHomeOwnerName(state),
        ownerFullName: getHomeOwnerFullName(state),
        avatarDefault: getHomeOwnerAvatar(state),
        receiverPostingId: state.detailedPosting.comments.receiverPostingId,
        comment: getCommentDialogComment(state),
        draft: state.detailedPosting.commentDialog.draft,
        repliedToId: getCommentDialogComment(state)?.repliedTo?.id ?? null,
        conflict: isCommentDialogConflict(state),
        reactionsPositiveDefault: getSetting(state, "comment.reactions.positive.default") as string,
        reactionsNegativeDefault: getSetting(state, "comment.reactions.negative.default") as string,
        sourceFormatDefault: getSetting(state, "comment.body-src-format.default") as SourceFormat,
        loading: state.detailedPosting.commentDialog.loading,
        beingPosted: state.detailedPosting.commentDialog.beingPosted,
        submitKey: getSetting(state, "comment.submit-key") as string,
        smileysEnabled: getSetting(state, "comment.smileys.enabled") as boolean
    }),
    { commentPost, closeCommentDialog, commentDialogConflictClose, confirmBox }
);

export default connector(
    withFormik(commentComposeLogic as WithFormikConfig<OuterProps, CommentComposeValues>)(CommentDialog)
);
