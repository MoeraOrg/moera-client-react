import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { CommentText } from "api";
import { ClientState } from "state/state";
import {
    closeCommentDialog,
    commentDialogCommentReset,
    commentDialogConflictClose
} from "state/detailedposting/actions";
import { getSetting } from "state/settings/selectors";
import { getCommentsState, isCommentDialogConflict } from "state/detailedposting/selectors";
import { confirmBox } from "state/confirmbox/actions";
import { getPostingFeatures } from "state/compose/selectors";
import { Browser } from "ui/browser";
import NodeName from "ui/nodename/NodeName";
import { Button, ConflictWarning, ModalDialog } from "ui/control";
import { AvatarField, RichTextField } from "ui/control/field";
import RichTextLinkPreviews from "ui/control/richtexteditor/RichTextLinkPreviews";
import {
    commentComposeLogic,
    CommentComposeProps,
    CommentComposeValues,
    valuesToCommentText
} from "ui/comment/comment-compose";
import CommentDraftSaver from "ui/comment/CommentDraftSaver";
import { insertText } from "util/misc";
import "./CommentDialog.css";

type Props = CommentComposeProps & FormikProps<CommentComposeValues>;

function CommentDialog(props: Props) {
    const {ownerName, ownerFullName, draft, comment, smileysEnabled, sourceFormatDefault, submitForm} = props;

    const commentId = comment?.id ?? null;

    const receiverName = useSelector((state: ClientState) => getCommentsState(state).receiverName);
    const conflict = useSelector(isCommentDialogConflict);
    const loading = useSelector((state: ClientState) =>
        state.detailedPosting.commentDialog.loading || state.detailedPosting.commentDialog.loadingDraft);
    const loaded = useSelector((state: ClientState) =>
        state.detailedPosting.commentDialog.loaded && state.detailedPosting.commentDialog.loadedDraft);
    const beingPosted = useSelector((state: ClientState) => state.detailedPosting.commentDialog.beingPosted);
    const submitKey = useSelector((state: ClientState) => getSetting(state, "comment.submit-key") as string);
    const features = useSelector(getPostingFeatures);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const [initialText, setInitialText] = useState<CommentText>({ownerName: "", bodySrc: ""});

    useEffect(() => {
        const values = commentComposeLogic.mapPropsToValues(props);
        const commentText = valuesToCommentText(values, props);
        if (commentText != null) {
            setInitialText(commentText);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [commentId, loaded, setInitialText]); // 'props' are missing on purpose

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
                        <AvatarField name="avatar" size={36}/>
                        <NodeName name={ownerName} fullName={ownerFullName} linked={false} popup={false}/>
                    </div>
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

export default withFormik(commentComposeLogic)(CommentDialog);
