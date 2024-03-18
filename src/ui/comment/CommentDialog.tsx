import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { SourceFormat } from "api";
import { ClientState } from "state/state";
import { getHomeOwnerAvatar, getHomeOwnerFullName, getHomeOwnerGender, getHomeOwnerName } from "state/home/selectors";
import { getSetting } from "state/settings/selectors";
import {
    closeCommentDialog,
    commentDialogCommentReset,
    commentDialogConflictClose
} from "state/detailedposting/actions";
import {
    getCommentDialogComment,
    getCommentsReceiverName,
    getCommentsReceiverPostingId,
    isCommentDialogConflict,
    isCommentDialogReady
} from "state/detailedposting/selectors";
import { confirmBox } from "state/confirmbox/actions";
import { getPostingFeatures } from "state/compose/selectors";
import * as Browser from "ui/browser";
import NodeName from "ui/nodename/NodeName";
import { Button, ConflictWarning, ModalDialog } from "ui/control";
import { AvatarField } from "ui/control/field";
import { RichTextField, RichTextLinkPreviews } from "ui/control/richtexteditor";
import { commentComposeLogic, CommentComposeProps, CommentComposeValues } from "ui/comment/comment-compose";
import CommentDraftSaver from "ui/comment/CommentDraftSaver";
import { insertText } from "util/ui";
import "./CommentDialog.css";
import { REL_CURRENT } from "util/rel-node-name";

type Props = CommentComposeProps & FormikProps<CommentComposeValues>;

function CommentDialogInner(props: Props) {
    const {
        ownerName, ownerFullName, draft, comment, smileysEnabled, sourceFormatDefault, resetForm, submitForm
    } = props;

    const commentId = comment?.id ?? null;

    const ready = useSelector(isCommentDialogReady);
    const receiverName = useSelector(getCommentsReceiverName);
    const conflict = useSelector(isCommentDialogConflict);
    const loading = useSelector((state: ClientState) =>
        state.detailedPosting.commentDialog.loading || state.detailedPosting.commentDialog.loadingDraft);
    const beingPosted = useSelector((state: ClientState) => state.detailedPosting.commentDialog.beingPosted);
    const submitKey = useSelector((state: ClientState) => getSetting(state, "comment.submit-key") as string);
    const features = useSelector(getPostingFeatures);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    useEffect(() => {
        const values = commentComposeLogic.mapPropsToValues(props);
        resetForm({values});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [commentId, ready]); // 'props' are missing on purpose

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
            dispatch(closeCommentDialog());
        } else {
            dispatch(confirmBox(
                t("forget-changes"), t("forget"), t("cancel"), commentDialogCommentReset(draft.id, true), null, "danger"
            ));
        }
        event.preventDefault();
    };

    return (
        <ModalDialog title={t("edit-comment")} className="comment-dialog" loading={loading}
                     onClose={() => dispatch(closeCommentDialog())}>
            {conflict &&
                <ConflictWarning text={t("comment-edited-conflict")}
                                 onClose={() => dispatch(commentDialogConflictClose())}/>
            }
            <Form>
                <div className="modal-body">
                    <div className="owner-line">
                        <AvatarField name="avatar" size={36} disabled={!ready || beingPosted}/>
                        <NodeName name={ownerName} fullName={ownerFullName} linked={false} popup={false}/>
                    </div>
                    <RichTextField name="body" rows={5} features={features} nodeName={receiverName ?? REL_CURRENT}
                                   forceImageCompress anyValue autoFocus disabled={!ready || beingPosted}
                                   smileysEnabled={smileysEnabled} format={sourceFormatDefault} onKeyDown={onKeyDown}
                                   urlsField="bodyUrls"/>
                    <RichTextLinkPreviews name="linkPreviews" urlsField="bodyUrls"
                                          nodeName={receiverName ?? REL_CURRENT} features={features} small
                                          disabled={!ready || beingPosted}/>
                </div>
                <div className="modal-footer">
                    {ready && <CommentDraftSaver commentId={commentId}/>}
                    <Button variant="secondary" disabled={!ready || beingPosted} onClick={onCancel}>
                        {t("cancel")}
                    </Button>
                    <Button variant="primary" type="submit" loading={beingPosted} disabled={!ready || beingPosted}>
                        {t("update")}
                    </Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

const CommentDialogOuter = withFormik(commentComposeLogic)(CommentDialogInner);

export default function CommentDialog() {
    const ownerName = useSelector(getHomeOwnerName);
    const ownerFullName = useSelector(getHomeOwnerFullName);
    const ownerGender = useSelector(getHomeOwnerGender);
    const avatarDefault = useSelector(getHomeOwnerAvatar);
    const receiverPostingId = useSelector(getCommentsReceiverPostingId);
    const comment = useSelector(getCommentDialogComment);
    const draft = useSelector((state: ClientState) => state.detailedPosting.commentDialog.draft);
    const reactionsPositiveDefault = useSelector((state: ClientState) =>
        getSetting(state, "comment.reactions.positive.default") as string);
    const reactionsNegativeDefault = useSelector((state: ClientState) =>
        getSetting(state, "comment.reactions.negative.default") as string);
    const sourceFormatDefault = useSelector((state: ClientState) =>
        getSetting(state, "comment.body-src-format.default") as SourceFormat);
    const smileysEnabled = useSelector((state: ClientState) => getSetting(state, "comment.smileys.enabled") as boolean);

    return <CommentDialogOuter avatarDefault={avatarDefault} receiverPostingId={receiverPostingId} comment={comment}
                               draft={draft} ownerName={ownerName} ownerFullName={ownerFullName}
                               ownerGender={ownerGender} smileysEnabled={smileysEnabled}
                               sourceFormatDefault={sourceFormatDefault}
                               reactionsPositiveDefault={reactionsPositiveDefault}
                               reactionsNegativeDefault={reactionsNegativeDefault}
                               repliedToId={comment?.repliedTo?.id ?? null}/>;
}
