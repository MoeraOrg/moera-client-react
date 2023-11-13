import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikProps, withFormik, WithFormikConfig } from 'formik';
import scrollIntoView from 'scroll-into-view-if-needed';
import { useTranslation } from 'react-i18next';

import { SourceFormat } from "api";
import { ClientState } from "state/state";
import { getPostingFeatures } from "state/compose/selectors";
import { getSetting } from "state/settings/selectors";
import { commentPost } from "state/detailedposting/actions";
import { bottomMenuHide, bottomMenuShow } from "state/navigation/actions";
import { getHomeOwnerAvatar, getHomeOwnerFullName, getHomeOwnerGender, getHomeOwnerName } from "state/home/selectors";
import {
    getCommentComposerRepliedToId,
    getCommentsReceiverFullName,
    getCommentsReceiverName,
    getCommentsReceiverPostingId
} from "state/detailedposting/selectors";
import { Browser } from "ui/browser";
import { AvatarField, RichTextField } from "ui/control/field";
import RichTextLinkPreviews from "ui/control/richtexteditor/RichTextLinkPreviews";
import CommentComposeRepliedTo from "ui/comment/CommentComposeRepliedTo";
import commentComposeLogic, { CommentComposeValues } from "ui/comment/comment-compose-logic";
import CommentComposeButtons from "ui/comment/CommentComposeButtons";
import { insertText, mentionName } from "util/misc";
import "./CommentCompose.css";

type OuterProps = ConnectedProps<typeof connector>;

type Props = OuterProps & FormikProps<CommentComposeValues>;

function CommentCompose(props: Props) {
    const {
        beingPosted, receiverName, receiverPostingId, loadedDraft, formId, submitKey, bottomMenuHide,
        bottomMenuShow, receiverFullName, smileysEnabled, features,
        sourceFormatDefault, values, resetForm, submitForm
    } = props;

    const {t} = useTranslation();

    useEffect(() => {
        const values = commentComposeLogic.mapPropsToValues(props);
        resetForm({values});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [receiverName, receiverPostingId, loadedDraft, formId, resetForm]); // 'props' are missing on purpose

    useEffect(viewComposer, [values.body.text]);

    const onFocus = () => {
        if (values.body.text.length !== 0) {
            viewComposer();
        }
        bottomMenuHide();
    }

    const onBlur = () => {
        if (values.body.text.trim().length === 0) {
            bottomMenuShow();
        }
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

    const mention = receiverFullName ? receiverFullName : mentionName(receiverName);
    return (
        <div id="comment-composer" onFocus={onFocus} onBlur={onBlur}>
            <Form>
                <AvatarField name="avatar" size={36}/>
                <div className="content">
                    <CommentComposeRepliedTo/>
                    <RichTextField name="body" rows={1} maxHeight="max(100vh - 26rem, 7.5em)" features={features}
                                   nodeName={receiverName} forceImageCompress anyValue
                                   placeholder={t("write-comment-here", {mention})} disabled={beingPosted}
                                   smileysEnabled={smileysEnabled}
                                   hidingPanel={commentComposeLogic.areValuesEmpty(values)} format={sourceFormatDefault}
                                   onKeyDown={onKeyDown} urlsField="bodyUrls"/>
                    <RichTextLinkPreviews name="linkPreviews" urlsField="bodyUrls" nodeName={receiverName}
                                          features={features} small/>
                </div>
                <CommentComposeButtons loading={beingPosted}/>
            </Form>
        </div>
    );
}

function viewComposer() {
    const composer = document.getElementById("comment-composer");
    if (composer != null && composer.contains(document.activeElement)) {
        setTimeout(() => scrollIntoView(composer, {scrollMode: "if-needed", block: "nearest"}));
    }
}

const connector = connect(
    (state: ClientState) => ({
        ownerName: getHomeOwnerName(state),
        ownerFullName: getHomeOwnerFullName(state),
        ownerGender: getHomeOwnerGender(state),
        avatarDefault: getHomeOwnerAvatar(state),
        receiverName: getCommentsReceiverName(state),
        receiverFullName: getCommentsReceiverFullName(state),
        receiverPostingId: getCommentsReceiverPostingId(state),
        comment: null,
        draft: state.detailedPosting.compose.draft,
        loadedDraft: state.detailedPosting.compose.loadedDraft,
        formId: state.detailedPosting.compose.formId,
        repliedToId: getCommentComposerRepliedToId(state),
        beingPosted: state.detailedPosting.compose.beingPosted,
        reactionsPositiveDefault: getSetting(state, "comment.reactions.positive.default") as string,
        reactionsNegativeDefault: getSetting(state, "comment.reactions.negative.default") as string,
        sourceFormatDefault: getSetting(state, "comment.body-src-format.default") as SourceFormat,
        submitKey: getSetting(state, "comment.submit-key") as string,
        smileysEnabled: getSetting(state, "comment.smileys.enabled") as boolean,
        features: getPostingFeatures(state)
    }),
    { commentPost, bottomMenuHide, bottomMenuShow }
);

export default connector(
    withFormik(commentComposeLogic as WithFormikConfig<OuterProps, CommentComposeValues>)(CommentCompose)
);
