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
    getCommentsReceiverName,
    getCommentsReceiverPostingId,
    isCommentComposerReady
} from "state/detailedposting/selectors";
import { AvatarField } from "ui/control/field";
import { RichTextField } from "ui/control/richtexteditor";
import { Scripture } from "ui/control/richtexteditor/visual/scripture";
import { isScriptureEmpty } from "ui/control/richtexteditor/visual/scripture-editor";
import CommentComposeRepliedTo from "ui/comment/compose/CommentComposeRepliedTo";
import { commentComposeLogic, CommentComposeProps, CommentComposeValues } from "ui/comment/compose/comment-compose";
import CommentComposePanel from "ui/comment/compose/CommentComposePanel";
import { REL_CURRENT } from "util/rel-node-name";
import { isHtmlEmpty } from "util/html";
import "./CommentCompose.css";

type Props = CommentComposeProps & FormikProps<CommentComposeValues>;

function CommentCompose(props: Props) {
    const {sourceFormatDefault, smileysEnabled, formId, values, resetForm, submitForm} = props;

    const ready = useSelector(isCommentComposerReady);
    const receiverName = useSelector(getCommentsReceiverName);
    const receiverPostingId = useSelector(getCommentsReceiverPostingId);
    const loadedDraft = useSelector((state: ClientState) => state.detailedPosting.compose.loadedDraft);
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

    useEffect(viewComposer, [values.body.value]);

    const onFocus = () => {
        if (!isBodyTextEmpty(values.body.value)) {
            viewComposer();
        }
        dispatch(bottomMenuHide());
    }

    const onBlur = () => {
        if (isBodyTextEmpty(values.body.value)) {
            dispatch(bottomMenuShow());
        }
    }

    return (
        <div id="comment-compose" onFocus={onFocus} onBlur={onBlur}>
            <Form>
                <AvatarField name="avatar" size={36} disabled={!ready || beingPosted}/>
                <div className="content">
                    <CommentComposeRepliedTo disabled={!ready || beingPosted}/>
                    <RichTextField
                        name="body"
                        rows={2}
                        minHeight="4em"
                        maxHeight="max(100vh - 26rem, 7.2em)"
                        features={features}
                        nodeName={receiverName ?? REL_CURRENT}
                        forceImageCompress
                        noEmbeddedMedia
                        anyValue
                        placeholder={t("write-comment")}
                        disabled={!ready || beingPosted}
                        smileysEnabled={smileysEnabled}
                        commentQuote
                        panelMode="none"
                        format={sourceFormatDefault}
                        submitKey={submitKey}
                        onSubmit={() => submitForm()}
                        urlsField="bodyUrls"
                        linkPreviewsField="linkPreviews"
                        linkPreviewsSmall
                    >
                        <CommentComposePanel/>
                    </RichTextField>
                </div>
            </Form>
        </div>
    );
}

function viewComposer() {
    const composer = document.getElementById("comment-compose");
    if (composer != null && composer.contains(document.activeElement)) {
        setTimeout(() => scrollIntoView(composer, {scrollMode: "if-needed", block: "nearest"}));
    }
}

const isBodyTextEmpty = (text: string | Scripture) =>
    typeof text === "string" ? isHtmlEmpty(text) : isScriptureEmpty(text);

export default withFormik(commentComposeLogic)(CommentCompose);
