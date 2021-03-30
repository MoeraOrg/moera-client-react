import * as yup from 'yup';
import { fromUnixTime, getUnixTime, isEqual } from 'date-fns';

import { ClientSettings } from "api";
import { replaceSmileys } from "util/text";

const composePageLogic = {

    mapPropsToValues(props) {
        const subject = props.posting != null && props.posting.bodySrc.subject != null
            ? props.posting.bodySrc.subject : "";
        const body = props.posting != null ? props.posting.bodySrc.text : "";
        const bodyFormat = props.posting != null ? props.posting.bodySrcFormat : props.sourceFormatDefault;
        const publishAt = props.posting != null && props.posting.publishedAt != null
            ? fromUnixTime(props.posting.publishedAt) : new Date();
        const reactionsPositive = props.posting != null
            ? props.posting.acceptedReactions.positive : props.reactionsPositiveDefault;
        const reactionsNegative = props.posting != null
            ? props.posting.acceptedReactions.negative : props.reactionsNegativeDefault;
        const reactionsVisible =
            props.posting != null ? props.posting.reactionsVisible : props.reactionsVisibleDefault;
        const reactionTotalsVisible =
            props.posting != null ? props.posting.reactionTotalsVisible : props.reactionTotalsVisibleDefault;
        const updateImportant = props.posting != null && props.posting.draftPending && props.posting.updateInfo != null
            ? (props.posting.updateInfo.important ?? false): false;
        const updateDescription = props.posting != null && props.posting.draftPending && props.posting.updateInfo != null
            ? (props.posting.updateInfo.description ?? ""): "";

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
            reactionTotalsVisible,
            updateInfoVisible: false,
            updateImportant,
            updateDescription
        };
    },

    validationSchema: yup.object().shape({
        body: yup.string().trim().required("Must not be empty")
    }),

    _replaceSmileys(props, text) {
        return props.smileysEnabled ? replaceSmileys(text) : text;
    },

    mapValuesToPostingText(values, props) {
        return {
            bodySrc: JSON.stringify({
                subject: props.subjectPresent ? this._replaceSmileys(props, values.subject.trim()) : null,
                text: this._replaceSmileys(props, values.body.trim())
            }),
            bodySrcFormat: values.bodyFormat.trim(),
            acceptedReactions: {positive: values.reactionsPositive, negative: values.reactionsNegative},
            reactionsVisible: values.reactionsVisible,
            reactionTotalsVisible: values.reactionTotalsVisible,
            publications: props.postingId != null ? null : [{
                feedName: "timeline",
                publishAt: isEqual(values.publishAt, values.publishAtDefault) ? getUnixTime(values.publishAt) : null,
            }],
            updateInfo: {
                important: values.updateImportant,
                description: values.updateDescription
            }
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
