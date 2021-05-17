import * as yup from 'yup';

import { replaceSmileys } from "util/text";

const commentComposeLogic = {

    mapPropsToValues(props) {
        const avatar = props.comment != null ? props.comment.ownerAvatar : props.avatarDefault;
        const body = props.comment != null ? props.comment.bodySrc.text : "";

        return {
            avatar,
            body
        };
    },

    validationSchema: yup.object().shape({
        body: yup.string().trim().required("Must not be empty")
    }),

    _replaceSmileys(props, text) {
        return props.smileysEnabled ? replaceSmileys(text) : text;
    },

    mapValuesToCommentText(values, props) {
        return {
            ownerName: props.ownerName,
            ownerFullName: props.ownerFullName,
            ownerAvatar: values.avatar ? {
                mediaId: values.avatar.mediaId,
                shape: values.avatar.shape,
                optional: true
            } : null,
            bodySrc: JSON.stringify({
                text: this._replaceSmileys(props, values.body.trim())
            }),
            bodySrcFormat: props.sourceFormatDefault,
            acceptedReactions: {positive: props.reactionsPositiveDefault, negative: props.reactionsNegativeDefault},
            repliedToId: props.repliedToId
        };
    },

    handleSubmit(values, formik) {
        formik.setStatus("submitted");
        formik.props.commentPost(
            formik.props.receiverPostingId,
            formik.props.comment != null ? formik.props.comment.id : null,
            commentComposeLogic.mapValuesToCommentText(values, formik.props)
        );
        formik.setSubmitting(false);
    }

};

export default commentComposeLogic;
