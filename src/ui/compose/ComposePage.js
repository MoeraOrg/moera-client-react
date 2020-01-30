import React from 'react';
import { connect } from 'react-redux';
import { Form, withFormik } from 'formik';
import * as yup from 'yup';
import moment from 'moment';

import { Page } from "ui/page/Page";
import { Button, ConflictWarning, Loading } from "ui/control";
import { InputField, TextField } from "ui/control/field";
import ComposeBodyFormatButton from "ui/compose/ComposeBodyFormatButton";
import ComposeBodyFormat from "ui/compose/ComposeBodyFormat";
import ComposePublishAtButton from "ui/compose/ComposePublishAtButton";
import ComposePublishAt from "ui/compose/ComposePublishAt";
import ComposeReactions from "ui/compose/ComposeReactions";
import ComposeReactionsButton from "ui/compose/ComposeReactionsButton";
import ComposeSubmitButton from "ui/compose/ComposeSubmitButton";
import { goToPosting } from "state/navigation/actions";
import { composeConflictClose, composePost } from "state/compose/actions";
import { getSetting } from "state/settings/selectors";
import { settingsUpdate } from "state/settings/actions";
import { ClientSettings } from "api";

import "./ComposePage.css";

class ComposePage extends React.PureComponent {

    constructor(props, context) {
        super(props, context);

        this.onGoToPostingClick = this.onGoToPostingClick.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.posting != null && prevProps.posting == null) {
            this.props.resetForm();
        }
    }

    onGoToPostingClick() {
        this.props.goToPosting(this.props.postingId);
    }

    render() {
        const {loadingFeatures, subjectPresent, sourceFormats, loadingPosting, postingId, conflict, beingPosted,
               composeConflictClose} = this.props;
        const title = postingId == null ? "New Post" : "Edit Post";
        return (
            <Page>
                <h2>
                    {title}
                    {postingId != null &&
                    <Button variant="outline-secondary" size="sm" className="ml-3"
                            onClick={this.onGoToPostingClick}>
                        &larr; Post
                    </Button>
                    }
                    <Loading active={loadingFeatures || loadingPosting}/>
                </h2>

                <div className="composer">
                    <Form>
                        <ConflictWarning text="The post was edited by somebody." show={conflict}
                                         onClose={composeConflictClose}/>
                        {subjectPresent &&
                        <InputField name="subject" title="Title" anyValue disabled={loadingPosting}/>
                        }
                        <TextField name="body" anyValue autoFocus disabled={loadingPosting}/>

                        <ComposeBodyFormat sourceFormats={sourceFormats}/>
                        <ComposePublishAt/>
                        <ComposeReactions/>

                        <ComposeBodyFormatButton sourceFormats={sourceFormats}/>
                        <ComposePublishAtButton/>
                        <ComposeReactionsButton/>

                        <ComposeSubmitButton loading={beingPosted} update={postingId != null}/>
                    </Form>
                </div>
            </Page>
        );
    }

}

const composePageLogic = {

    mapPropsToValues(props) {
        const subject = props.posting != null && props.posting.bodySrc.subject != null
            ? props.posting.bodySrc.subject : "";
        const body = props.posting != null ? props.posting.bodySrc.text : "";
        const bodyFormat = props.posting != null ? props.posting.bodySrcFormat : props.sourceFormatDefault;
        const publishAt = props.posting != null ? moment.unix(props.posting.publishedAt).toDate() : new Date();
        const reactionsPositive = props.posting != null
            ? props.posting.acceptedReactions.positive : props.reactionsPositiveDefault;
        const reactionsNegative = props.posting != null
            ? props.posting.acceptedReactions.negative : props.reactionsNegativeDefault;
        const reactionsVisible =
            props.posting != null ? props.posting.reactionsVisible : props.reactionsVisibleDefault;
        const reactionTotalsVisible =
            props.posting != null ? props.posting.reactionTotalsVisible : props.reactionTotalsVisibleDefault;

        return {
            subject,
            body,
            bodyFormatVisible: false,
            bodyFormatDefault: bodyFormat,
            bodyFormat,
            publishAtVisible: false,
            publishAtDefault: publishAt,
            publishAt,
            reactionVisible: false,
            reactionsPositiveDefault: reactionsPositive,
            reactionsPositive,
            reactionsNegativeDefault: reactionsNegative,
            reactionsNegative,
            reactionsVisibleDefault: reactionsVisible,
            reactionsVisible,
            reactionTotalsVisibleDefault: reactionTotalsVisible,
            reactionTotalsVisible
        };
    },

    validationSchema: yup.object().shape({
        body: yup.string().trim().required("Must not be empty")
    }),

    handleSubmit(values, formik) {
        formik.props.composePost(
            formik.props.postingId, {
                bodySrc: JSON.stringify({
                        subject: formik.props.subjectPresent ? values.subject.trim() : null,
                        text: values.body.trim()
                    }),
                bodySrcFormat: values.bodyFormat.trim(),
                publishAt: values.publishAt.getTime() === values.publishAtDefault.getTime()
                    ? moment(values.publishAt).unix() : null,
                acceptedReactions: {positive: values.reactionsPositive, negative: values.reactionsNegative},
                reactionsVisible: values.reactionsVisible,
                reactionTotalsVisible: values.reactionTotalsVisible
            }
        );
        if (values.bodyFormat.trim() !== formik.props.sourceFormatDefault) {
            formik.props.settingsUpdate([{
                name: ClientSettings.PREFIX + "posting.body-src-format.default",
                value: values.bodyFormat.trim()
            }]);
        }
        formik.setSubmitting(false);
    }

};

export default connect(
    state => ({
        loadingFeatures: state.compose.loadingFeatures,
        subjectPresent: state.compose.subjectPresent,
        sourceFormats: state.compose.sourceFormats,
        loadingPosting: state.compose.loadingPosting,
        postingId: state.compose.postingId,
        posting: state.compose.posting,
        conflict: state.compose.conflict,
        beingPosted: state.compose.beingPosted,
        reactionsPositiveDefault: getSetting(state, "posting.reactions.positive.default"),
        reactionsNegativeDefault: getSetting(state, "posting.reactions.negative.default"),
        reactionsVisibleDefault: getSetting(state, "posting.reactions.visible.default"),
        reactionTotalsVisibleDefault: getSetting(state, "posting.reactions.totals-visible.default"),
        sourceFormatDefault: getSetting(state, "posting.body-src-format.default")
    }),
    { goToPosting, composePost, composeConflictClose, settingsUpdate }
)(withFormik(composePageLogic)(ComposePage));
