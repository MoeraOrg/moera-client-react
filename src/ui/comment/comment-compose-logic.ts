import * as yup from 'yup';

import { replaceSmileys } from "util/text";
import { toAvatarDescription } from "util/avatar";
import { AvatarImage, CommentInfo, CommentText, DraftInfo, SourceFormat } from "api/node/api-types";
import { FormikBag } from "formik";

interface MapToValuesProps {
    comment: CommentInfo | null;
    draft: DraftInfo | null;
    avatarDefault: AvatarImage | null;
}

interface MapToCommentTextProps {
    ownerName: string | null;
    ownerFullName: string | null;
    smileysEnabled: boolean;
    sourceFormatDefault: SourceFormat;
    reactionsPositiveDefault: string;
    reactionsNegativeDefault: string;
    repliedToId: string | null;
}

interface CommentComposeProps extends MapToValuesProps, MapToCommentTextProps {
    receiverPostingId: string | null;
    commentPost: (postingId: string, commentId: string | null, commentText: CommentText) => void;
}

export interface CommentComposeValues {
    avatar: AvatarImage | null;
    body: string;
}

const commentComposeLogic = {

    mapPropsToValues(props: MapToValuesProps): CommentComposeValues {
        const avatar = props.draft != null
            ? (props.draft.ownerAvatar ?? null)
            : (props.comment != null ? (props.comment.ownerAvatar ?? null) : props.avatarDefault);
        const body = props.draft != null
            ? (props.draft.bodySrc?.text ?? "")
            : (props.comment != null ? (props.comment.bodySrc?.text ?? "") : "");

        return {
            avatar,
            body
        };
    },

    validationSchema: yup.object().shape({
        body: yup.string().trim().required("Must not be empty")
    }),

    _replaceSmileys(smileysEnabled: boolean, text: string): string {
        return smileysEnabled ? replaceSmileys(text) : text;
    },

    mapValuesToCommentText(values: CommentComposeValues, props: MapToCommentTextProps): CommentText | null {
        if (props.ownerName == null) {
            return null;
        }

        return {
            ownerName: props.ownerName,
            ownerFullName: props.ownerFullName,
            ownerAvatar: toAvatarDescription(values.avatar),
            bodySrc: JSON.stringify({
                text: this._replaceSmileys(props.smileysEnabled, values.body.trim())
            }),
            bodySrcFormat: props.sourceFormatDefault,
            acceptedReactions: {positive: props.reactionsPositiveDefault, negative: props.reactionsNegativeDefault},
            repliedToId: props.repliedToId
        };
    },

    isCommentTextEmpty(commentText: CommentText): boolean {
        if (commentText.bodySrc == null) {
            return true;
        }

        const {text} = JSON.parse(commentText.bodySrc);
        return !text;
    },

    handleSubmit(values: CommentComposeValues, formik: FormikBag<CommentComposeProps, CommentComposeValues>): void {
        formik.setStatus("submitted");
        const commentText = commentComposeLogic.mapValuesToCommentText(values, formik.props);
        if (formik.props.receiverPostingId != null && commentText != null) {
            formik.props.commentPost(
                formik.props.receiverPostingId,
                formik.props.comment != null ? formik.props.comment.id : null,
                commentText
            );
        }
        formik.setSubmitting(false);
    }

};

export default commentComposeLogic;
