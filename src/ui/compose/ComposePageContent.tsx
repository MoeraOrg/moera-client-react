import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { PostingText } from "api";
import { ClientState } from "state/state";
import { isAtHomeNode } from "state/node/selectors";
import { composeConflictClose } from "state/compose/actions";
import { ConflictWarning, Loading } from "ui/control";
import { AvatarField, InputField, RichTextField } from "ui/control/field";
import { Page } from "ui/page/Page";
import PageHeader from "ui/page/PageHeader";
import ComposeFullName from "ui/compose/ComposeFullName";
import ComposeFormattingHelp from "ui/compose/ComposeFormattingHelp";
import RichTextLinkPreviews from "ui/control/richtexteditor/RichTextLinkPreviews";
import ComposeBodyFormatButton from "ui/compose/ComposeBodyFormatButton";
import ComposeBodyFormat from "ui/compose/ComposeBodyFormat";
import ComposePublishAt from "ui/compose/ComposePublishAt";
import ComposeViewPrincipal from "ui/compose/ComposeViewPrincipal";
import ComposeComments from "ui/compose/ComposeComments";
import ComposeReactions from "ui/compose/ComposeReactions";
import ComposeUpdateInfo from "ui/compose/ComposeUpdateInfo";
import ComposeCommentsButton from "ui/compose/ComposeCommentsButton";
import ComposeReactionsButton from "ui/compose/ComposeReactionsButton";
import ComposeUpdateInfoButton from "ui/compose/ComposeUpdateInfoButton";
import ComposeDraftSaver from "ui/compose/ComposeDraftSaver";
import ComposeDraftSelector from "ui/compose/ComposeDraftSelector";
import ComposeResetButton from "ui/compose/ComposeResetButton";
import ComposePreviewButton from "ui/compose/ComposePreviewButton";
import ComposeSubmitButton from "ui/compose/ComposeSubmitButton";
import {
    areImagesUploaded,
    areValuesEmpty,
    composePageLogic,
    ComposePageProps,
    ComposePageValues,
    valuesToPostingText
} from "ui/compose/posting-compose";
import ComposePreviewDialog from "ui/compose/ComposePreviewDialog";
import Jump from "ui/navigation/Jump";
import "./ComposePageContent.css";

type Props = ComposePageProps & FormikProps<ComposePageValues>;

function ComposePageContent(props: Props) {
    const {postingId, features, avatarDefault, posting, sharedText, smileysEnabled, values, resetForm} = props;

    const formId = useSelector((state: ClientState) => state.compose.formId);
    const loadingPosting = useSelector((state: ClientState) => state.compose.loadingPosting);
    const loadingDraft = useSelector((state: ClientState) => state.compose.loadingDraft);
    const atHomeNode = useSelector(isAtHomeNode);
    const postAllowed = features?.post ?? atHomeNode;
    const conflict = useSelector((state: ClientState) => state.compose.conflict);
    const beingPosted = useSelector((state: ClientState) => state.compose.beingPosted);
    const showPreview = useSelector((state: ClientState) => state.compose.showPreview);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const [initialPostingText, setInitialPostingText] = useState<PostingText>({bodySrc: ""});

    const [postWarningClosed, setPostWarningClosed] = useState<boolean>(false);

    const postWarningClose = () => setPostWarningClosed(true);

    useEffect(() => {
        const values = composePageLogic.mapPropsToValues(props);
        setInitialPostingText(valuesToPostingText(values, props));
        resetForm({values});
        setPostWarningClosed(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [posting, avatarDefault, formId, sharedText, setInitialPostingText, setPostWarningClosed]); // 'props' are missing on purpose

    const title = postingId == null ? t("new-post-title") : t("edit-post-title");
    const loadingContent = loadingPosting || loadingDraft;
    const sourceFormats = features?.sourceFormats ?? [];
    const submitDisabled = areValuesEmpty(values) || !areImagesUploaded(values);
    return (
        <>
            <PageHeader>
                <h2>
                    {title}
                    {postingId != null &&
                        <Jump className="btn btn-sm btn-outline-secondary ms-3" href={`/post/${postingId}`}>
                            {t("to-post")}
                        </Jump>
                    }
                    {loadingContent && <Loading/>}
                </h2>
            </PageHeader>
            <Page className="compose-page">
                <div className="composer">
                    <Form>
                        {(!postAllowed && !postWarningClosed) &&
                            <ConflictWarning text={t("post-not-allowed")} onClose={postWarningClose}/>
                        }
                        {conflict &&
                            <ConflictWarning text={t("post-edited-conflict")}
                                             onClose={() => dispatch(composeConflictClose())}/>
                        }
                        <div className="info">
                            <AvatarField name="avatar" size={56}/>
                            <div className="body">
                                <ComposeFullName/>
                                <ComposePublishAt/>
                                <ComposeViewPrincipal/>
                            </div>
                        </div>
                        {features?.subjectPresent &&
                            <InputField name="subject" title="Title" anyValue disabled={loadingContent}/>
                        }
                        <RichTextField name="body" disabled={loadingContent || beingPosted}
                                       format={values.bodyFormat ?? "markdown"} smileysEnabled={smileysEnabled}
                                       features={features} nodeName="" urlsField="bodyUrls" anyValue autoFocus
                                       maxHeight="max(100vh - 26rem, 9em)"/>
                        <ComposeFormattingHelp/>
                        <RichTextLinkPreviews name="linkPreviews" urlsField="bodyUrls" features={features}/>

                        <div className="features">
                            <div className="feature-buttons">
                                <ComposeBodyFormatButton sourceFormats={sourceFormats}/>
                                <ComposeCommentsButton/>
                                <ComposeReactionsButton/>
                                {postingId != null &&
                                    <ComposeUpdateInfoButton/>
                                }
                            </div>
                            <div className="drafts">
                                <ComposeDraftSaver initialText={initialPostingText}/>
                                <ComposeResetButton/>
                                <ComposeDraftSelector/>
                            </div>
                        </div>

                        <ComposeBodyFormat sourceFormats={sourceFormats}/>
                        <ComposeComments/>
                        <ComposeReactions/>
                        <ComposeUpdateInfo/>

                        <div className="form-buttons">
                            <ComposePreviewButton disabled={submitDisabled}/>
                            <ComposeSubmitButton loading={beingPosted} update={postingId != null}
                                                 disabled={submitDisabled}/>
                        </div>
                    </Form>
                </div>
                {showPreview && <ComposePreviewDialog/>}
            </Page>
        </>
    );
}

export default withFormik(composePageLogic)(ComposePageContent);
