import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikProps, withFormik } from 'formik';
import scrollIntoView from 'scroll-into-view-if-needed';
import { useTranslation } from 'react-i18next';

import { SourceFormat } from "api";
import { ClientState } from "state/state";
import { getPostingFeatures } from "state/compose/selectors";
import { getSetting } from "state/settings/selectors";
import { bottomMenuHide, bottomMenuShow } from "state/navigation/actions";
import {
    getCommentsReceiverFullName,
    getCommentsReceiverName,
    getCommentsReceiverPostingId
} from "state/detailedposting/selectors";
import { Browser } from "ui/browser";
import { AvatarField, RichTextField } from "ui/control/field";
import RichTextLinkPreviews from "ui/control/richtexteditor/RichTextLinkPreviews";
import CommentComposeRepliedTo from "ui/comment/CommentComposeRepliedTo";
import {
    areValuesEmpty,
    commentComposeLogic,
    CommentComposeProps,
    CommentComposeValues
} from "ui/comment/comment-compose";
import CommentComposeButtons from "ui/comment/CommentComposeButtons";
import { insertText, mentionName } from "util/misc";
import "./CommentCompose.css";

type Props = CommentComposeProps & FormikProps<CommentComposeValues>;

function CommentCompose(props: Props) {
    const {values, resetForm, submitForm} = props;

    const receiverName = useSelector(getCommentsReceiverName);
    const receiverFullName = useSelector(getCommentsReceiverFullName);
    const receiverPostingId = useSelector(getCommentsReceiverPostingId);
    const loadedDraft = useSelector((state: ClientState) => state.detailedPosting.compose.loadedDraft);
    const formId = useSelector((state: ClientState) => state.detailedPosting.compose.formId);
    const beingPosted = useSelector((state: ClientState) => state.detailedPosting.compose.beingPosted);
    const sourceFormatDefault = useSelector((state: ClientState) =>
        getSetting(state, "comment.body-src-format.default") as SourceFormat);
    const submitKey = useSelector((state: ClientState) => getSetting(state, "comment.submit-key") as string);
    const smileysEnabled = useSelector((state: ClientState) => getSetting(state, "comment.smileys.enabled") as boolean);
    const features = useSelector(getPostingFeatures);
    const dispatch = useDispatch();
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
        dispatch(bottomMenuHide());
    }

    const onBlur = () => {
        if (values.body.text.trim().length === 0) {
            dispatch(bottomMenuShow());
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
                                   hidingPanel={areValuesEmpty(values)} format={sourceFormatDefault}
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

export default withFormik(commentComposeLogic)(CommentCompose);
