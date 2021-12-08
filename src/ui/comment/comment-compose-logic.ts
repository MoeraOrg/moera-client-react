import { FormikBag } from 'formik';

import { AvatarImage, CommentInfo, CommentSourceText, CommentText, DraftInfo, SourceFormat } from "api/node/api-types";
import { RichTextValue } from "ui/control";
import { replaceSmileys } from "util/text";
import { toAvatarDescription } from "util/avatar";

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
    commentPost: (postingId: string, commentId: string | null, draftId: string | null,
                  commentText: CommentText, commentSourceText: CommentSourceText) => void;
}

export interface CommentComposeValues {
    avatar: AvatarImage | null;
    body: RichTextValue;
}

const commentComposeLogic = {

    mapPropsToValues(props: MapToValuesProps): CommentComposeValues {
        const avatar = props.draft != null
            ? (props.draft.ownerAvatar ?? null)
            : (props.comment != null ? (props.comment.ownerAvatar ?? null) : props.avatarDefault);
        const body = props.draft != null
            ? (props.draft.bodySrc?.text ?? "")
            : (props.comment != null ? (props.comment.bodySrc?.text ?? "") : "");
        const media = props.draft != null
            ? (props.draft.media != null ? props.draft.media.map(mf => mf.media) : [])
            : (props.comment != null && props.comment.media != null ? props.comment.media.map(mf => mf.media) : []);

        return {
            avatar,
            body: new RichTextValue(body, media)
        };
    },

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
                text: this._replaceSmileys(props.smileysEnabled, values.body.text.trim())
            }),
            bodySrcFormat: props.sourceFormatDefault,
            media: values.body.orderedMediaList(),
            acceptedReactions: {positive: props.reactionsPositiveDefault, negative: props.reactionsNegativeDefault},
            repliedToId: props.repliedToId
        };
    },

    mapValuesToCommentSourceText(values: CommentComposeValues, props: MapToCommentTextProps): CommentSourceText {
        return {
            ownerAvatar: toAvatarDescription(values.avatar),
            bodySrc: JSON.stringify({
                text: this._replaceSmileys(props.smileysEnabled, values.body.text.trim())
            }),
            bodySrcFormat: props.sourceFormatDefault,
            media: values.body.orderedMediaListWithDigests(),
            acceptedReactions: {positive: props.reactionsPositiveDefault, negative: props.reactionsNegativeDefault},
            repliedToId: props.repliedToId
        };
    },

    areValuesEmpty(values: CommentComposeValues): boolean {
        return values.body.text.trim() === ""
            && (values.body.media == null || values.body.media.length === 0);
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
        const commentSourceText = commentComposeLogic.mapValuesToCommentSourceText(values, formik.props);
        if (formik.props.receiverPostingId != null && commentText != null) {
            formik.props.commentPost(
                formik.props.receiverPostingId,
                formik.props.comment != null ? formik.props.comment.id : null,
                formik.props.draft?.id ?? null,
                commentText,
                commentSourceText
            );
        }
        formik.setSubmitting(false);
    }

};

export default commentComposeLogic;
