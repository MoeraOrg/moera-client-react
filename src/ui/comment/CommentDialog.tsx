import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikProps, withFormik, WithFormikConfig } from 'formik';
import { useTranslation } from 'react-i18next';

import { CommentText, SourceFormat } from "api/node/api-types";
import { ClientState } from "state/state";
import {
    commentDialogCommentReset,
    closeCommentDialog,
    commentDialogConflictClose,
    commentPost
} from "state/detailedposting/actions";
import { getSetting } from "state/settings/selectors";
import { getHomeOwnerAvatar, getHomeOwnerFullName, getHomeOwnerGender, getHomeOwnerName } from "state/home/selectors";
import { getCommentDialogComment, getCommentsState, isCommentDialogConflict } from "state/detailedposting/selectors";
import { confirmBox } from "state/confirmbox/actions";
import { getPostingFeatures } from "state/compose/selectors";
import { Browser } from "ui/browser";
import NodeName from "ui/nodename/NodeName";
import { Button, ConflictWarning, Loading, ModalDialog } from "ui/control";
import { AvatarField, RichTextField } from "ui/control/field";
import RichTextLinkPreviews from "ui/control/richtexteditor/RichTextLinkPreviews";
import commentComposeLogic, { CommentComposeValues } from "ui/comment/comment-compose-logic";
import CommentDraftSaver from "ui/comment/CommentDraftSaver";
import { insertText } from "util/misc";
import "./CommentDialog.css";

type OuterProps = ConnectedProps<typeof connector>;

type Props = OuterProps & FormikProps<CommentComposeValues>;

function CommentDialog(props: Props) {
    const {
        show, ownerName, ownerFullName, receiverName, comment, draft, loaded, conflict, loading, beingPosted,
        smileysEnabled, features, sourceFormatDefault, closeCommentDialog, commentDialogConflictClose, confirmBox,
        submitKey, submitForm, resetForm
    } = props;

    const commentId = comment != null ? comment.id : null;

    const {t} = useTranslation();

    const [initialText, setInitialText] = useState<CommentText>({ownerName: "", bodySrc: ""});

    useEffect(() => {
        const values = commentComposeLogic.mapPropsToValues(props);
        const commentText = commentComposeLogic.mapValuesToCommentText(values, props);
        if (commentText != null) {
            setInitialText(commentText);
        }
        resetForm({values});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, commentId, loaded, setInitialText]); // 'props' are missing on purpose

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
                insertText(event.target as HTMLTextAreaElement, "\n");
            }
            event.preventDefault();
        }
    }

    const onCancel = (event: React.MouseEvent) => {
        if (draft == null) {
            closeCommentDialog();
        } else {
            confirmBox(t("forget-changes"), t("forget"), t("cancel"),
                commentDialogCommentReset(draft.id, true), null, "danger");
        }
        event.preventDefault();
    };

    return (
        <ModalDialog title={t("edit-comment")} className="comment-dialog" onClose={closeCommentDialog}>
            <ConflictWarning text={t("comment-edited-conflict")} show={conflict}
                             onClose={commentDialogConflictClose}/>
            <Form>
                <div className="modal-body">
                    <div className="owner-line">
                        <AvatarField name="avatar" size={36}/>
                        <NodeName name={ownerName} fullName={ownerFullName} linked={false} popup={false}/>
                    </div>
                    <Loading active={loading}/>
                    <RichTextField name="body" rows={5} features={features} nodeName={receiverName} forceImageCompress
                                   anyValue autoFocus disabled={loading || beingPosted} smileysEnabled={smileysEnabled}
                                   format={sourceFormatDefault} onKeyDown={onKeyDown} urlsField="bodyUrls"/>
                    <RichTextLinkPreviews name="linkPreviews" urlsField="bodyUrls" nodeName={receiverName}
                                          features={features} small/>
                </div>
                <div className="modal-footer">
                    <CommentDraftSaver initialized={loaded} initialText={initialText} commentId={commentId}/>
                    <Button variant="secondary" onClick={onCancel}>{t("cancel")}</Button>
                    <Button variant="primary" type="submit" loading={beingPosted}>{t("update")}</Button>
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
        ownerGender: getHomeOwnerGender(state),
        avatarDefault: getHomeOwnerAvatar(state),
        receiverName: getCommentsState(state).receiverName,
        receiverPostingId: getCommentsState(state).receiverPostingId,
        comment: getCommentDialogComment(state),
        draft: state.detailedPosting.commentDialog.draft,
        repliedToId: getCommentDialogComment(state)?.repliedTo?.id ?? null,
        conflict: isCommentDialogConflict(state),
        reactionsPositiveDefault: getSetting(state, "comment.reactions.positive.default") as string,
        reactionsNegativeDefault: getSetting(state, "comment.reactions.negative.default") as string,
        sourceFormatDefault: getSetting(state, "comment.body-src-format.default") as SourceFormat,
        loading: state.detailedPosting.commentDialog.loading || state.detailedPosting.commentDialog.loadingDraft,
        loaded: state.detailedPosting.commentDialog.loaded && state.detailedPosting.commentDialog.loadedDraft,
        beingPosted: state.detailedPosting.commentDialog.beingPosted,
        submitKey: getSetting(state, "comment.submit-key") as string,
        smileysEnabled: getSetting(state, "comment.smileys.enabled") as boolean,
        features: getPostingFeatures(state)
    }),
    { commentPost, closeCommentDialog, commentDialogConflictClose, confirmBox }
);

export default connector(
    withFormik(commentComposeLogic as WithFormikConfig<OuterProps, CommentComposeValues>)(CommentDialog)
);
