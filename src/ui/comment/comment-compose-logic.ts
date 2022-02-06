import { FormikBag } from 'formik';

import { AvatarImage, CommentInfo, CommentSourceText, CommentText, DraftInfo, SourceFormat } from "api/node/api-types";
import { RichTextValue } from "ui/control";
import { replaceSmileys } from "util/text";
import { toAvatarDescription } from "util/avatar";
import { RichTextMedia } from "state/richtexteditor/actions";
import deepEqual from "react-fast-compare";

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
            ? props.draft.ownerAvatar ?? null
            : props.comment != null ? props.comment.ownerAvatar ?? null : props.avatarDefault;
        const body = props.draft != null
            ? props.draft.bodySrc?.text ?? ""
            : props.comment != null ? props.comment.bodySrc?.text ?? "" : "";
        const media: (RichTextMedia | null)[] = props.draft != null
            ? (props.draft.media != null
                ? props.draft.media.map(ma => ma.media != null ? {...ma.media, digest: ma.remoteMedia?.digest} : null)
                : [])
            : (props.comment != null && props.comment.media != null
                ? props.comment.media.map(mf => mf.media ?? null)
                : []);

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

    areImagesUploaded(values: CommentComposeValues): boolean {
        return values.body.media == null || values.body.media.every(media => media != null);
    },

    isCommentTextEmpty(commentText: CommentText): boolean {
        let textEmpty = commentText.bodySrc == null;
        if (!textEmpty) {
            const {text} = JSON.parse(commentText.bodySrc!);
            textEmpty = !text;
        }
        const mediaEmpty = commentText.media == null || commentText.media.length === 0;
        return textEmpty && mediaEmpty;
    },

    isCommentTextChanged(commentText: CommentText, comment: CommentInfo | null) {
        if (comment == null) {
            return !this.isCommentTextEmpty(commentText);
        }
        if (commentText.bodySrc == null || comment.bodySrc == null) {
            return (commentText.bodySrc == null) !== (comment.bodySrc == null);
        }
        const {text} = JSON.parse(commentText.bodySrc);
        const {text: prevText} = comment.bodySrc;
        if (text !== prevText) {
            return true;
        }
        const media = commentText.media ?? [];
        const prevMedia = comment.media != null ? comment.media.map(ma => ma.media?.id ?? ma.remoteMedia?.id) : [];
        return !deepEqual(media, prevMedia);
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
