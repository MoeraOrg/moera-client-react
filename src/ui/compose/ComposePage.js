import React from 'react';
import { connect } from 'react-redux';
import { Form, withFormik } from 'formik';

import { getSetting } from "state/settings/selectors";
import { settingsUpdate } from "state/settings/actions";
import { composeConflictClose, composePost } from "state/compose/actions";
import { ConflictWarning, Loading } from "ui/control";
import { InputField, RichTextField } from "ui/control/field";
import { Page } from "ui/page/Page";
import ComposeFormattingHelp from "ui/compose/ComposeFormattingHelp";
import ComposeBodyFormatButton from "ui/compose/ComposeBodyFormatButton";
import ComposeBodyFormat from "ui/compose/ComposeBodyFormat";
import ComposePublishAtButton from "ui/compose/ComposePublishAtButton";
import ComposePublishAt from "ui/compose/ComposePublishAt";
import ComposeReactions from "ui/compose/ComposeReactions";
import ComposeReactionsButton from "ui/compose/ComposeReactionsButton";
import ComposeDraftSaver from "ui/compose/ComposeDraftSaver";
import ComposeDraftSelector from "ui/compose/ComposeDraftSelector";
import ComposeSubmitButton from "ui/compose/ComposeSubmitButton";
import ComposeResetButton from "ui/compose/ComposeResetButton";
import Jump from "ui/navigation/Jump";
import composePageLogic from "ui/compose/compose-page-logic";
import { parseBool } from "util/misc";
import "./ComposePage.css";

class ComposePage extends React.PureComponent {

    constructor(props, context) {
        super(props, context);

        this.state = {initialPostingText: {}};
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((this.props.posting != null && prevProps.posting == null)
            || (this.props.posting == null && prevProps.posting != null)
            || (this.props.draftId == null && prevProps.draftId != null)) {
            const values = composePageLogic.mapPropsToValues(this.props);
            this.setState({initialPostingText: composePageLogic.mapValuesToPostingText(values, this.props)});
            this.props.resetForm({values});
        }
    }

    render() {
        const {loadingFeatures, subjectPresent, sourceFormats, loadingPosting, postingId, loadingDraft, conflict,
               beingPosted, smileysEnabled, composeConflictClose} = this.props;
        const title = postingId == null ? "New Post" : "Edit Post";
        const loadingContent = loadingPosting || loadingDraft;
        return (
            <Page className="mt-3">
                <h2>
                    {title}
                    {postingId != null &&
                        <Jump className="btn btn-sm btn-outline-secondary ml-3" href={`/post/${postingId}`}>
                            &larr; Post
                        </Jump>
                    }
                    <Loading active={loadingFeatures || loadingContent}/>
                </h2>

                <div className="composer">
                    <Form>
                        <ConflictWarning text="The post was edited by somebody." show={conflict}
                                         onClose={composeConflictClose}/>
                        {subjectPresent &&
                            <InputField name="subject" title="Title" anyValue disabled={loadingContent}/>
                        }
                        <RichTextField name="body" disabled={loadingContent || beingPosted}
                                       smileysEnabled={smileysEnabled} anyValue autoFocus/>
                        <ComposeFormattingHelp/>

                        <ComposeBodyFormat sourceFormats={sourceFormats}/>
                        <ComposePublishAt/>
                        <ComposeReactions/>

                        <div className="features">
                            <div className="feature-buttons">
                                <ComposeBodyFormatButton sourceFormats={sourceFormats}/>
                                {postingId == null &&
                                    <ComposePublishAtButton/>
                                }
                                <ComposeReactionsButton/>
                            </div>
                            <div className="drafts">
                                <ComposeDraftSaver initialPostingText={this.state.initialPostingText}/>
                                <ComposeDraftSelector/>
                            </div>
                        </div>

                        <div className="form-buttons">
                            <ComposeSubmitButton loading={beingPosted} update={postingId != null}/>
                            <ComposeResetButton/>
                        </div>
                    </Form>
                </div>
            </Page>
        );
    }

}

export default connect(
    state => ({
        loadingFeatures: state.compose.loadingFeatures,
        subjectPresent: state.compose.subjectPresent,
        sourceFormats: state.compose.sourceFormats,
        loadingPosting: state.compose.loadingPosting,
        postingId: state.compose.postingId,
        loadingDraft: state.compose.loadingDraft,
        draftId: state.compose.draftId,
        posting: state.compose.posting,
        conflict: state.compose.conflict,
        beingPosted: state.compose.beingPosted,
        reactionsPositiveDefault: getSetting(state, "posting.reactions.positive.default"),
        reactionsNegativeDefault: getSetting(state, "posting.reactions.negative.default"),
        reactionsVisibleDefault: getSetting(state, "posting.reactions.visible.default"),
        reactionTotalsVisibleDefault: getSetting(state, "posting.reactions.totals-visible.default"),
        sourceFormatDefault: getSetting(state, "posting.body-src-format.default"),
        smileysEnabled: parseBool(getSetting(state, "posting.smileys.enabled"))
    }),
    { composePost, composeConflictClose, settingsUpdate }
)(withFormik(composePageLogic)(ComposePage));
