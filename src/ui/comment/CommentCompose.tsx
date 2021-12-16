import React, { useCallback, useEffect, useRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikProps, withFormik, WithFormikConfig } from 'formik';
import * as textFieldEdit from 'text-field-edit'
import scrollIntoView from 'scroll-into-view-if-needed';

import { SourceFormat } from "api/node/api-types";
import { ClientState } from "state/state";
import { getPostingFeatures } from "state/compose/selectors";
import { getSetting } from "state/settings/selectors";
import { commentPost } from "state/detailedposting/actions";
import { openSignUpDialog } from "state/signupdialog/actions";
import { openConnectDialog } from "state/connectdialog/actions";
import { bottomMenuHide, bottomMenuShow } from "state/navigation/actions";
import { getHomeOwnerAvatar, getHomeOwnerFullName, getHomeOwnerName } from "state/home/selectors";
import { getCommentComposerRepliedToId, getCommentsState } from "state/detailedposting/selectors";
import { Browser } from "ui/browser";
import { Button } from "ui/control";
import { AvatarField, RichTextField } from "ui/control/field";
import CommentComposeRepliedTo from "ui/comment/CommentComposeRepliedTo";
import commentComposeLogic, { CommentComposeValues } from "ui/comment/comment-compose-logic";
import CommentComposeButtons from "ui/comment/CommentComposeButtons";
import { mentionName } from "util/misc";
import "./CommentCompose.css";

type OuterProps = ConnectedProps<typeof connector>;

type Props = OuterProps & FormikProps<CommentComposeValues>;

function CommentCompose(props: Props) {
    const {
        ownerName, beingPosted, receiverName, receiverPostingId, loaded, formId, submitKey, bottomMenuHide,
        bottomMenuShow, receiverFullName, smileysEnabled, features, sourceFormatDefault, openSignUpDialog,
        openConnectDialog, values, resetForm, submitForm
    } = props;

    const composer = useRef<HTMLDivElement>(null);

    const viewComposer = useCallback(() => {
        if (composer.current != null && composer.current.contains(document.activeElement)) {
            scrollIntoView(composer.current, {scrollMode: "if-needed", block: "nearest"});
        }
    }, [composer]);

    useEffect(() => {
        const values = commentComposeLogic.mapPropsToValues(props);
        resetForm({values});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [receiverName, receiverPostingId, loaded, formId, resetForm]); // 'props' are missing on purpose

    useEffect(viewComposer, [values.body.text, viewComposer]);

    const onFocus = () => {
        viewComposer();
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
                textFieldEdit.insert(event.target as HTMLTextAreaElement, "\n");
            }
            event.preventDefault();
        }
    }

    const mention = receiverFullName ? receiverFullName : mentionName(receiverName);
    if (ownerName) {
        return (
            <div id="comment-composer" ref={composer} onFocus={onFocus} onBlur={onBlur}>
                <Form>
                    <AvatarField name="avatar" size={36}/>
                    <div className="content">
                        <CommentComposeRepliedTo/>
                        <RichTextField name="body" rows={1} features={features} nodeName={receiverName}
                                       forceImageCompress anyValue placeholder={`Write a comment to ${mention} here...`}
                                       disabled={beingPosted} smileysEnabled={smileysEnabled}
                                       hidingPanel={commentComposeLogic.areValuesEmpty(values)}
                                       format={sourceFormatDefault} onKeyDown={onKeyDown}/>
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
        receiverName: getCommentsState(state).receiverName,
        receiverFullName: getCommentsState(state).receiverFullName,
        receiverPostingId: getCommentsState(state).receiverPostingId,
        comment: null,
        draft: state.detailedPosting.compose.draft,
        loaded: state.detailedPosting.compose.loaded,
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
    { commentPost, openSignUpDialog, openConnectDialog, bottomMenuHide, bottomMenuShow }
);

export default connector(
    withFormik(commentComposeLogic as WithFormikConfig<OuterProps, CommentComposeValues>)(CommentCompose)
);
