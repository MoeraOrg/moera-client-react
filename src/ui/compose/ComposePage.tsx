import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikProps, withFormik } from 'formik';

import { PostingText, SourceFormat } from "api/node/api-types";
import { ClientState } from "state/state";
import { getHomeOwnerAvatar, getHomeOwnerFullName } from "state/home/selectors";
import { getSetting } from "state/settings/selectors";
import { settingsUpdate } from "state/settings/actions";
import { composeConflictClose, composePost } from "state/compose/actions";
import { ConflictWarning, Loading } from "ui/control";
import { AvatarField, InputField, RichTextField } from "ui/control/field";
import { Page } from "ui/page/Page";
import PageHeader from "ui/page/PageHeader";
import ComposeFullName from "ui/compose/ComposeFullName";
import ComposeFormattingHelp from "ui/compose/ComposeFormattingHelp";
import ComposeBodyFormatButton from "ui/compose/ComposeBodyFormatButton";
import ComposeBodyFormat from "ui/compose/ComposeBodyFormat";
import ComposePublishAt from "ui/compose/ComposePublishAt";
import ComposeReactions from "ui/compose/ComposeReactions";
import ComposeUpdateInfo from "ui/compose/ComposeUpdateInfo";
import ComposeReactionsButton from "ui/compose/ComposeReactionsButton";
import ComposeUpdateInfoButton from "ui/compose/ComposeUpdateInfoButton";
import ComposeDraftSaver from "ui/compose/ComposeDraftSaver";
import ComposeDraftSelector from "ui/compose/ComposeDraftSelector";
import ComposeResetButton from "ui/compose/ComposeResetButton";
import ComposePreviewButton from "ui/compose/ComposePreviewButton";
import ComposeSubmitButton from "ui/compose/ComposeSubmitButton";
import composePageLogic, { ComposePageValues } from "ui/compose/compose-page-logic";
import ComposePreviewDialog from "ui/compose/ComposePreviewDialog";
import Jump from "ui/navigation/Jump";
import "./ComposePage.css";

export type ComposePageOuterProps = ConnectedProps<typeof connector>;

type Props = ComposePageOuterProps & FormikProps<ComposePageValues>;

interface State {
    initialPostingText: PostingText;
}

class ComposePage extends React.PureComponent<Props, State> {

    constructor(props: Props, context: any) {
        super(props, context);

        this.state = {initialPostingText: {bodySrc: ""}};
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
        if ((this.props.posting != null && prevProps.posting == null)
            || (this.props.posting == null && prevProps.posting != null)
            || (this.props.avatarDefault != null && prevProps.avatarDefault == null)
            || (this.props.draftId == null && prevProps.draftId != null)
            || (this.props.sharedText != null && prevProps.sharedText == null)) {
            const values = composePageLogic.mapPropsToValues(this.props);
            this.setState({initialPostingText: composePageLogic.mapValuesToPostingText(values, this.props)});
            this.props.resetForm({values});
        }
    }

    render() {
        const {loadingFeatures, subjectPresent, sourceFormats, loadingPosting, postingId, loadingDraft, conflict,
               beingPosted, smileysEnabled, composeConflictClose, values} = this.props;
        const title = postingId == null ? "New Post" : "Edit Post";
        const loadingContent = loadingPosting || loadingDraft;
        const submitDisabled = composePageLogic.areValuesEmpty(values);
        return (
            <>
                <PageHeader>
                    <h2>
                        {title}
                        {postingId != null &&
                            <Jump className="btn btn-sm btn-outline-secondary ms-3" href={`/post/${postingId}`}>
                                &larr; Post
                            </Jump>
                        }
                        <Loading active={loadingFeatures || loadingContent}/>
                    </h2>
                </PageHeader>
                <Page className="compose-page">
                    <div className="composer">
                        <Form>
                            <ConflictWarning text="The post was edited by somebody." show={conflict}
                                             onClose={composeConflictClose}/>
                            <div className="info">
                                <AvatarField name="avatar" size={56}/>
                                <div className="body">
                                    <ComposeFullName/>
                                    <ComposePublishAt/>
                                </div>
                            </div>
                            {subjectPresent &&
                                <InputField name="subject" title="Title" anyValue disabled={loadingContent}/>
                            }
                            <RichTextField name="body" disabled={loadingContent || beingPosted}
                                           format={values.bodyFormat ?? "markdown"} smileysEnabled={smileysEnabled}
                                           anyValue autoFocus/>
                            <ComposeFormattingHelp/>

                            <ComposeBodyFormat sourceFormats={sourceFormats}/>
                            <ComposeReactions/>
                            <ComposeUpdateInfo/>

                            <div className="features">
                                <div className="feature-buttons">
                                    <ComposeBodyFormatButton sourceFormats={sourceFormats}/>
                                    <ComposeReactionsButton/>
                                    {postingId != null &&
                                        <ComposeUpdateInfoButton/>
                                    }
                                </div>
                                <div className="drafts">
                                    <ComposeDraftSaver initialText={this.state.initialPostingText}/>
                                    <ComposeResetButton/>
                                    <ComposeDraftSelector/>
                                </div>
                            </div>

                            <div className="form-buttons">
                                <ComposePreviewButton disabled={submitDisabled}/>
                                <ComposeSubmitButton loading={beingPosted} update={postingId != null}
                                                     disabled={submitDisabled}/>
                            </div>
                        </Form>
                    </div>
                    <ComposePreviewDialog/>
                </Page>
            </>
        );
    }

}

const connector = connect(
    (state: ClientState) => ({
        loadingFeatures: state.compose.loadingFeatures,
        avatarDefault: getHomeOwnerAvatar(state),
        fullNameDefault: getHomeOwnerFullName(state),
        subjectPresent: state.compose.subjectPresent,
        sourceFormats: state.compose.sourceFormats,
        loadingPosting: state.compose.loadingPosting,
        postingId: state.compose.postingId,
        loadingDraft: state.compose.loadingDraft,
        draftId: state.compose.draftId,
        posting: state.compose.posting,
        conflict: state.compose.conflict,
        beingPosted: state.compose.beingPosted,
        sharedText: state.compose.sharedText,
        sharedTextType: state.compose.sharedTextType,
        reactionsPositiveDefault: getSetting(state, "posting.reactions.positive.default") as string,
        reactionsNegativeDefault: getSetting(state, "posting.reactions.negative.default") as string,
        reactionsVisibleDefault: getSetting(state, "posting.reactions.visible.default") as boolean,
        reactionTotalsVisibleDefault: getSetting(state, "posting.reactions.totals-visible.default") as boolean,
        sourceFormatDefault: getSetting(state, "posting.body-src-format.default") as SourceFormat,
        smileysEnabled: getSetting(state, "posting.smileys.enabled") as boolean,
        newsFeedEnabled: getSetting(state, "posting.feed.news.enabled") as boolean,
        avatarShapeDefault: getSetting(state, "avatar.shape.default") as string
    }),
    { composePost, composeConflictClose, settingsUpdate }
);

export default connector(withFormik(composePageLogic)(ComposePage));
