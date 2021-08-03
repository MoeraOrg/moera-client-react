import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikProps, withFormik, WithFormikConfig } from 'formik';
import * as textFieldEdit from 'text-field-edit'
import scrollIntoView from 'scroll-into-view-if-needed';

import { SourceFormat } from "api/node/api-types";
import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import { commentPost } from "state/detailedposting/actions";
import { openSignUpDialog } from "state/signupdialog/actions";
import { openConnectDialog } from "state/connectdialog/actions";
import { bottomMenuHide, bottomMenuShow } from "state/navigation/actions";
import { getHomeOwnerAvatar, getHomeOwnerFullName, getHomeOwnerName } from "state/home/selectors";
import { getCommentComposerRepliedToId } from "state/detailedposting/selectors";
import { Browser } from "ui/browser";
import { Button } from "ui/control";
import { AvatarField, RichTextField } from "ui/control/field";
import CommentComposeRepliedTo from "ui/comment/CommentComposeRepliedTo";
import commentComposeLogic, { CommentComposeValues } from "ui/comment/comment-compose-logic";
import CommentComposeButtons from "ui/comment/CommentComposeButtons";
import { mentionName } from "util/misc";
import "./CommentCompose.css";

function viewComposer() {
    const composer = document.getElementById("comment-composer")!;
    scrollIntoView(composer, {scrollMode: "if-needed", block: "end"});
}

type OuterProps = ConnectedProps<typeof connector>;

type Props = OuterProps & FormikProps<CommentComposeValues>;

function CommentCompose(props: Props) {
    const {
        ownerName, beingPosted, receiverName, receiverPostingId, draft, formId, submitKey, bottomMenuHide,
        bottomMenuShow, receiverFullName, smileysEnabled, sourceFormatDefault, openSignUpDialog, openConnectDialog,
        values, resetForm, submitForm
    } = props;

    useEffect(() => {
        const values = commentComposeLogic.mapPropsToValues(props);
        resetForm({values});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [receiverName, receiverPostingId, draft?.id, formId, resetForm]); // 'props' are missing on purpose

    const onFocus = () => {
        viewComposer();
        bottomMenuHide();
    }

    const onBlur = () => {
        if (values["body"].trim().length === 0) {
            bottomMenuShow();
        }
    }

    const onKeyDown = (event: React.KeyboardEvent) => {
        viewComposer();
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

    const mention = receiverFullName ? receiverFullName : mentionName(receiverName);
    if (ownerName) {
        return (
            <div id="comment-composer" onFocus={onFocus} onBlur={onBlur}>
                <Form>
                    <AvatarField name="avatar" size={36}/>
                    <div className="content">
                        <CommentComposeRepliedTo/>
                        <RichTextField name="body" rows={1} anyValue
                                       placeholder={`Write a comment to ${mention} here...`}
                                       disabled={beingPosted} smileysEnabled={smileysEnabled}
                                       hidingPanel={values.body.trim() === ""} format={sourceFormatDefault}
                                       onKeyDown={onKeyDown}/>
                    </div>
                    <CommentComposeButtons loading={beingPosted}/>
                </Form>
            </div>
        );
    } else {
        return (
            <div className="alert alert-info">
                To add comments, you need to&nbsp;
                <Button variant="primary" size="sm" onClick={() => openSignUpDialog()}>Sign Up</Button>
                &nbsp;or&nbsp;
                <Button variant="success" size="sm" onClick={() => openConnectDialog()}>Connect</Button>
            </div>
        );
    }
}

const connector = connect(
    (state: ClientState) => ({
        ownerName: getHomeOwnerName(state),
        ownerFullName: getHomeOwnerFullName(state),
        avatarDefault: getHomeOwnerAvatar(state),
        receiverName: state.detailedPosting.comments.receiverName,
        receiverFullName: state.detailedPosting.comments.receiverFullName,
        receiverPostingId: state.detailedPosting.comments.receiverPostingId,
        comment: null,
        draftId: state.detailedPosting.compose.draftId,
        draft: state.detailedPosting.compose.draft,
        formId: state.detailedPosting.compose.formId,
        repliedToId: getCommentComposerRepliedToId(state),
        beingPosted: state.detailedPosting.compose.beingPosted,
        reactionsPositiveDefault: getSetting(state, "comment.reactions.positive.default") as string,
        reactionsNegativeDefault: getSetting(state, "comment.reactions.negative.default") as string,
        sourceFormatDefault: getSetting(state, "comment.body-src-format.default") as SourceFormat,
        submitKey: getSetting(state, "comment.submit-key") as string,
        smileysEnabled: getSetting(state, "comment.smileys.enabled") as boolean
    }),
    { commentPost, openSignUpDialog, openConnectDialog, bottomMenuHide, bottomMenuShow }
);

export default connector(
    withFormik(commentComposeLogic as WithFormikConfig<OuterProps, CommentComposeValues>)(CommentCompose)
);
