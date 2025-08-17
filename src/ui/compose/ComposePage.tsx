import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { PrincipalValue, SourceFormat } from "api";
import { ClientState } from "state/state";
import { getHomeOwnerAvatar, getHomeOwnerFullName, getHomeOwnerGender, getHomeOwnerName } from "state/home/selectors";
import { getSetting } from "state/settings/selectors";
import { isAtHomeNode } from "state/node/selectors";
import { composeConflictClose } from "state/compose/actions";
import { getPostingFeatures, isComposeReady } from "state/compose/selectors";
import {
    areImagesUploaded,
    areValuesEmpty,
    composePageLogic,
    ComposePageProps,
    ComposePageValues
} from "ui/compose/posting-compose";
import { useIsTinyScreen } from "ui/hook/media-query";
import NodeName from "ui/nodename/NodeName";
import { ConflictWarning, Loading } from "ui/control";
import { AvatarField, InputField } from "ui/control/field";
import { RichTextField } from "ui/control/richtexteditor";
import { Page } from "ui/page/Page";
import PageHeader from "ui/page/PageHeader";
import Jump from "ui/navigation/Jump";
import ComposeViewPrincipal from "ui/compose/ComposeViewPrincipal";
import ComposeDrafts from "ui/compose/drafts/ComposeDrafts";
import ComposeFeatures from "ui/compose/features/ComposeFeatures";
import ComposeSubmitButton from "ui/compose/ComposeSubmitButton";
import ComposePreviewDialog from "ui/compose/ComposePreviewDialog";
import { REL_CURRENT } from "util/rel-node-name";
import "./ComposePage.css";

type Props = ComposePageProps & FormikProps<ComposePageValues>;

function ComposePageInner(props: Props) {
    const {postingId, features, avatarDefault, posting, sharedText, smileysEnabled, values, resetForm} = props;

    const ready = useSelector(isComposeReady);
    const formId = useSelector((state: ClientState) => state.compose.formId);
    const loadingContent = useSelector((state: ClientState) =>
        state.compose.loadingPosting || state.compose.loadingDraft
    );
    const ownerName = useSelector(getHomeOwnerName);
    const atHomeNode = useSelector(isAtHomeNode);
    const postAllowed = features?.post ?? atHomeNode;
    const conflict = useSelector((state: ClientState) => state.compose.conflict);
    const beingPosted = useSelector((state: ClientState) => state.compose.beingPosted);
    const showPreview = useSelector((state: ClientState) => state.compose.showPreview);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const [postWarningClosed, setPostWarningClosed] = useState<boolean>(false);

    const postWarningClose = () => setPostWarningClosed(true);

    useEffect(() => {
        const values = composePageLogic.mapPropsToValues(props);
        resetForm({values});
        setPostWarningClosed(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [posting, avatarDefault, formId, sharedText, setPostWarningClosed]); // 'props' are missing on purpose

    const tinyScreen = useIsTinyScreen();

    const title = postingId == null ? t("new-post-title") : t("edit-post-title");
    const sourceFormats = features?.sourceFormats ?? [];
    const submitDisabled = !ready || areValuesEmpty(values) || !areImagesUploaded(values);
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
                <div className="page-central-pane composer">
                    <Form>
                        {(!postAllowed && !postWarningClosed) &&
                            <ConflictWarning text={t("post-not-allowed")} onClose={postWarningClose}/>
                        }
                        {conflict &&
                            <ConflictWarning text={t("post-edited-conflict")}
                                             onClose={() => dispatch(composeConflictClose())}/>
                        }
                        <div className="info-line">
                            <div className="info">
                                <AvatarField name="avatar" size={56} disabled={!ready}/>
                                <div className="body">
                                    <NodeName name={ownerName} fullName={values.fullName} linked={false} popup={false}
                                              className="ms-2"/>
                                    <ComposeViewPrincipal/>
                                </div>
                            </div>
                            {!tinyScreen && <ComposeDrafts ready={ready}/>}
                        </div>
                        {features?.subjectPresent &&
                            <InputField name="subject" title="Title" anyValue disabled={!ready}/>
                        }
                        <RichTextField
                            name="body"
                            placeholder={t("whats-new")}
                            disabled={!ready || beingPosted}
                            format={values.bodyFormat}
                            smileysEnabled={smileysEnabled}
                            features={features}
                            nodeName={REL_CURRENT}
                            urlsField="bodyUrls"
                            linkPreviewsField="linkPreviews"
                            anyValue
                            autoFocus
                            maxHeight="max(100vh - 26rem, 10.8em)"
                        >
                            {tinyScreen && <ComposeDrafts ready={ready}/>}
                        </RichTextField>

                        <ComposeFeatures sourceFormats={sourceFormats} updateInfo={postingId != null}/>
                        <ComposeSubmitButton loading={beingPosted} update={postingId != null}
                                             disabled={submitDisabled}/>
                    </Form>
                </div>
                {showPreview && <ComposePreviewDialog/>}
            </Page>
        </>
    );
}

const ComposePageOuter = withFormik(composePageLogic)(ComposePageInner);

export default function ComposePage() {
    const gender = useSelector(getHomeOwnerGender);
    const fullNameDefault = useSelector(getHomeOwnerFullName);
    const avatarDefault = useSelector(getHomeOwnerAvatar);
    const postingId = useSelector((state: ClientState) => state.compose.postingId);
    const features = useSelector(getPostingFeatures);
    const posting = useSelector((state: ClientState) => state.compose.posting);
    const draft = useSelector((state: ClientState) => state.compose.draft);
    const sharedText = useSelector((state: ClientState) => state.compose.sharedText);
    const sharedTextType = useSelector((state: ClientState) => state.compose.sharedTextType);
    const smileysEnabled = useSelector((state: ClientState) =>
        getSetting(state, "posting.smileys.enabled") as boolean
    );
    const newsFeedEnabled = useSelector((state: ClientState) =>
        getSetting(state, "posting.feed.news.enabled") as boolean
    );
    const avatarShapeDefault = useSelector((state: ClientState) =>
        getSetting(state, "avatar.shape.default") as string
    );
    const visibilityDefault = useSelector((state: ClientState) =>
        getSetting(state, "posting.visibility.default") as PrincipalValue
    );
    const commentsVisibilityDefault = useSelector((state: ClientState) =>
        getSetting(state, "posting.comments.visibility.default") as PrincipalValue
    );
    const commentAdditionDefault = useSelector((state: ClientState) =>
        getSetting(state, "posting.comments.addition.default") as PrincipalValue
    );
    const commentsHideDefault = useSelector((state: ClientState) =>
        getSetting(state, "posting.comments.hide.default") as boolean
    );
    const reactionsEnabledDefault = useSelector((state: ClientState) =>
        getSetting(state, "posting.reactions.enabled.default") as boolean
    );
    const reactionsNegativeEnabledDefault = useSelector((state: ClientState) =>
        getSetting(state, "posting.reactions.negative.enabled.default") as boolean
    );
    const reactionsPositiveDefault = useSelector((state: ClientState) =>
        getSetting(state, "posting.reactions-disabled.positive.default") as string
    );
    const reactionsNegativeDefault = useSelector((state: ClientState) =>
        getSetting(state, "posting.reactions-disabled.negative.default") as string
    );
    const reactionsVisibleDefault = useSelector((state: ClientState) =>
        getSetting(state, "posting.reactions.visible.default") as boolean
    );
    const reactionTotalsVisibleDefault = useSelector((state: ClientState) =>
        getSetting(state, "posting.reactions.totals-visible.default") as boolean
    );
    const sourceFormatDefault = useSelector((state: ClientState) =>
        getSetting(state, "posting.body-src-format.default") as SourceFormat
    );

    return (
        <ComposePageOuter
            gender={gender}
            fullNameDefault={fullNameDefault}
            avatarDefault={avatarDefault}
            postingId={postingId}
            features={features}
            posting={posting}
            draft={draft}
            sharedText={sharedText}
            sharedTextType={sharedTextType}
            smileysEnabled={smileysEnabled}
            newsFeedEnabled={newsFeedEnabled}
            avatarShapeDefault={avatarShapeDefault}
            visibilityDefault={visibilityDefault}
            commentsVisibilityDefault={commentsVisibilityDefault}
            commentAdditionDefault={commentAdditionDefault}
            commentsHideDefault={commentsHideDefault}
            reactionsEnabledDefault={reactionsEnabledDefault}
            reactionsNegativeEnabledDefault={reactionsNegativeEnabledDefault}
            reactionsPositiveDefault={reactionsPositiveDefault}
            reactionsNegativeDefault={reactionsNegativeDefault}
            reactionsVisibleDefault={reactionsVisibleDefault}
            reactionTotalsVisibleDefault={reactionTotalsVisibleDefault}
            sourceFormatDefault={sourceFormatDefault}
        />
    );
}
