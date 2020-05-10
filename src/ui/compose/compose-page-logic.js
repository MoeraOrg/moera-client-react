import moment from 'moment';
import * as yup from 'yup';

import { ClientSettings } from "api";

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

    mapValuesToPostingText(values, props) {
        return {
            bodySrc: JSON.stringify({
                subject: props.subjectPresent ? values.subject.trim() : null,
                text: values.body.trim()
            }),
            bodySrcFormat: values.bodyFormat.trim(),
            acceptedReactions: {positive: values.reactionsPositive, negative: values.reactionsNegative},
            reactionsVisible: values.reactionsVisible,
            reactionTotalsVisible: values.reactionTotalsVisible,
            publications: props.postingId != null ? null : [{
                feedName: "timeline",
                publishAt: values.publishAt.getTime() !== values.publishAtDefault.getTime()
                    ? moment(values.publishAt).unix() : null,
            }]
        };
    },

    isPostingTextEmpty(postingText) {
        const {subject, text} = JSON.parse(postingText.bodySrc);
        return !subject && !text;
    },

    handleSubmit(values, formik) {
        formik.setStatus("submitted");
        formik.props.composePost(
            formik.props.postingId,
            formik.props.draftId,
            composePageLogic.mapValuesToPostingText(values, formik.props)
        );
        let settings = [];
        if (values.bodyFormat.trim() !== formik.props.sourceFormatDefault) {
            settings.push({
                name: ClientSettings.PREFIX + "posting.body-src-format.default",
                value: values.bodyFormat.trim()
            });
        }
        if (settings.length > 0) {
            formik.props.settingsUpdate(settings);
        }

        formik.setSubmitting(false);
    }

};

export default composePageLogic;
