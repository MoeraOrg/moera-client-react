import * as yup from 'yup';

const commentComposeLogic = {

    mapPropsToValues(props) {
        const body = props.comment != null ? props.comment.bodySrc.text : "";

        return {
            body
        };
    },

    validationSchema: yup.object().shape({
        body: yup.string().trim().required("Must not be empty")
    }),

    mapValuesToCommentText(values, props) {
        return {
            ownerName: props.ownerName,
            bodySrc: JSON.stringify({
                text: values.body.trim()
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
