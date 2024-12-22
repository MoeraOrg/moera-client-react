import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikProps, withFormik } from 'formik';
import scrollIntoView from 'scroll-into-view-if-needed';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getPostingFeatures } from "state/compose/selectors";
import { getSetting } from "state/settings/selectors";
import { bottomMenuHide, bottomMenuShow } from "state/navigation/actions";
import {
    getCommentsReceiverFullName,
    getCommentsReceiverName,
    getCommentsReceiverPostingId,
    isCommentComposerReady
} from "state/detailedposting/selectors";
import { AvatarField } from "ui/control/field";
import { RichTextField, RichTextLinkPreviews } from "ui/control/richtexteditor";
import CommentComposeRepliedTo from "ui/comment/CommentComposeRepliedTo";
import {
    areValuesEmpty,
    commentComposeLogic,
    CommentComposeProps,
    CommentComposeValues
} from "ui/comment/comment-compose";
import CommentComposeButtons from "ui/comment/CommentComposeButtons";
import { mentionName } from "util/names";
import { REL_CURRENT } from "util/rel-node-name";
import "./CommentCompose.css";

type Props = CommentComposeProps & FormikProps<CommentComposeValues>;

function CommentCompose(props: Props) {
    const {sourceFormatDefault, smileysEnabled, values, resetForm, submitForm} = props;

    const ready = useSelector(isCommentComposerReady);
    const receiverName = useSelector(getCommentsReceiverName);
    const receiverFullName = useSelector(getCommentsReceiverFullName);
    const receiverPostingId = useSelector(getCommentsReceiverPostingId);
    const loadedDraft = useSelector((state: ClientState) => state.detailedPosting.compose.loadedDraft);
    const formId = useSelector((state: ClientState) => state.detailedPosting.compose.formId);
    const beingPosted = useSelector((state: ClientState) => state.detailedPosting.compose.beingPosted);
    const submitKey = useSelector((state: ClientState) => getSetting(state, "comment.submit-key") as string);
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

    const mention = receiverFullName ? receiverFullName : mentionName(receiverName);
    return (
        <div id="comment-composer" onFocus={onFocus} onBlur={onBlur}>
            <Form>
                <AvatarField name="avatar" size={36} disabled={!ready || beingPosted}/>
                <div className="content">
                    <CommentComposeRepliedTo disabled={!ready || beingPosted}/>
                    <RichTextField name="body" rows={1} maxHeight="max(100vh - 26rem, 7.5em)" features={features}
                                   nodeName={receiverName ?? REL_CURRENT} forceImageCompress anyValue
                                   placeholder={t("write-comment-here", {mention})} disabled={!ready || beingPosted}
                                   smileysEnabled={smileysEnabled}
                                   hidingPanel={areValuesEmpty(values)} format={sourceFormatDefault}
                                   submitKey={submitKey} onSubmit={() => submitForm()} urlsField="bodyUrls"/>
                    <RichTextLinkPreviews name="linkPreviews" urlsField="bodyUrls"
                                          nodeName={receiverName ?? REL_CURRENT} features={features} small
                                          disabled={!ready || beingPosted}/>
                </div>
                <CommentComposeButtons/>
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
