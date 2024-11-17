import { FormikBag } from 'formik';
import deepEqual from 'react-fast-compare';

import {
    AvatarImage,
    CommentInfo,
    CommentSourceText,
    CommentText,
    DraftInfo,
    SourceFormat,
    VerifiedMediaFile
} from "api";
import store from "state/store";
import { commentPost } from "state/detailedposting/actions";
import { bodyToLinkPreviews, RichTextLinkPreviewsValue, RichTextValue } from "ui/control/richtexteditor";
import { Scripture } from "ui/control/richtexteditor/visual/scripture";
import { toScripture } from "ui/control/richtexteditor/visual/scripture-util";
import { toAvatarDescription } from "util/avatar";

interface PropsToValuesProps {
    comment: CommentInfo | null;
    draft: DraftInfo | null;
    avatarDefault: AvatarImage | null;
    sourceFormatDefault: SourceFormat;
}

interface ValuesToCommentTextProps {
    ownerName: string | null;
    ownerFullName: string | null;
    ownerGender: string | null;
    smileysEnabled: boolean;
    sourceFormatDefault: SourceFormat;
    reactionsPositiveDefault: string;
    reactionsNegativeDefault: string;
    repliedToId: string | null;
}

export interface CommentComposeValues {
    avatar: AvatarImage | null;
    body: RichTextValue;
    bodyUrls: string[];
    linkPreviews: RichTextLinkPreviewsValue;
}

export function valuesToCommentText(values: CommentComposeValues, props: ValuesToCommentTextProps): CommentText | null {
    if (props.ownerName == null) {
        return null;
    }

    return {
        ownerName: props.ownerName,
        ownerFullName: props.ownerFullName,
        ownerGender: props.ownerGender,
        ownerAvatar: toAvatarDescription(values.avatar),
        bodySrc: JSON.stringify({
            text: values.body.toString(props.smileysEnabled),
            linkPreviews: values.linkPreviews.previews
        }),
        bodySrcFormat: props.sourceFormatDefault,
        media: (values.body.orderedMediaList() ?? []).concat(values.linkPreviews.media.map(vm => vm.id)),
        acceptedReactions: {positive: props.reactionsPositiveDefault, negative: props.reactionsNegativeDefault},
        repliedToId: props.repliedToId
    };
}

function valuesToCommentSourceText(values: CommentComposeValues, props: ValuesToCommentTextProps): CommentSourceText {
    return {
        ownerAvatar: toAvatarDescription(values.avatar),
        bodySrc: JSON.stringify({
            text: values.body.toString(props.smileysEnabled),
            linkPreviews: values.linkPreviews.previews
        }),
        bodySrcFormat: props.sourceFormatDefault,
        media: (values.body.orderedMediaListWithDigests() ?? [])
            .concat(values.linkPreviews.media.map(vm => ({id: vm.id, digest: vm.digest}))),
        acceptedReactions: {positive: props.reactionsPositiveDefault, negative: props.reactionsNegativeDefault},
        repliedToId: props.repliedToId
    };
}

export function areValuesEmpty(values: CommentComposeValues): boolean {
    return values.body.text.trim() === "" && (values.body.media == null || values.body.media.length === 0);
}

export function areImagesUploaded(values: CommentComposeValues): boolean {
    return values.body.media == null || values.body.media.every(media => media != null);
}

export function isCommentTextEmpty(commentText: CommentText): boolean {
    let textEmpty = commentText.bodySrc == null;
    if (!textEmpty) {
        const {text} = JSON.parse(commentText.bodySrc!);
        textEmpty = !text;
    }
    const mediaEmpty = commentText.media == null || commentText.media.length === 0;
    return textEmpty && mediaEmpty;
}

export function isCommentTextChanged(commentText: CommentText, comment: CommentInfo | null) {
    if (comment == null) {
        return !isCommentTextEmpty(commentText);
    }
    if (commentText.bodySrc == null || comment.bodySrc == null) {
        return (commentText.bodySrc == null) !== (comment.bodySrc == null);
    }
    const {text, linkPreviews} = JSON.parse(commentText.bodySrc);
    const {text: prevText, linkPreviews: prevLinkPreviews} = comment.bodySrc;
    if (text !== prevText || !deepEqual(linkPreviews ?? [], prevLinkPreviews ?? [])) {
        return true;
    }
    const media = commentText.media ?? [];
    const prevMedia = comment.media != null ? comment.media.map(ma => ma.media?.id ?? ma.remoteMedia?.id) : [];
    return !deepEqual(media, prevMedia);
}

export interface CommentComposeProps extends PropsToValuesProps, ValuesToCommentTextProps {
    receiverPostingId: string | null;
}

export const commentComposeLogic = {

    mapPropsToValues(props: PropsToValuesProps): CommentComposeValues {
        const avatar = props.draft != null
            ? props.draft.ownerAvatar ?? null
            : props.comment != null ? props.comment.ownerAvatar ?? null : props.avatarDefault;
        const bodyFormat = props.draft != null
                ? props.draft.bodySrcFormat ?? "markdown"
                : props.comment != null ? props.comment.bodySrcFormat ?? "markdown" : props.sourceFormatDefault;
        let body: string | Scripture;
        body = props.draft != null
            ? props.draft.bodySrc?.text ?? ""
            : props.comment != null ? props.comment.bodySrc?.text ?? "" : "";
        if (bodyFormat === "visual-html") {
            body = toScripture(body);
        }
        const attachments = props.draft != null ? props.draft.media : props.comment?.media;
        let media = attachments != null
            ? attachments
                .map(ma => ma.media != null ? {...ma.media, digest: ma.remoteMedia?.digest} as VerifiedMediaFile : null)
                .filter((mf): mf is VerifiedMediaFile => mf != null)
            : [];

        const linkPreviewsInfo = props.draft != null
            ? props.draft.bodySrc?.linkPreviews ?? []
            : props.comment != null ? props.comment.bodySrc?.linkPreviews ?? [] : [];
        let linkPreviews, bodyUrls;
        [linkPreviews, bodyUrls, media] = bodyToLinkPreviews(body, linkPreviewsInfo, media);

        return {
            avatar,
            body: new RichTextValue(body, bodyFormat, media),
            bodyUrls,
            linkPreviews
        };
    },

    handleSubmit(values: CommentComposeValues, formik: FormikBag<CommentComposeProps, CommentComposeValues>): void {
        formik.setStatus("submitted");
        const commentText = valuesToCommentText(values, formik.props);
        const commentSourceText = valuesToCommentSourceText(values, formik.props);
        if (formik.props.receiverPostingId != null && commentText != null) {
            store.dispatch(commentPost(
                formik.props.receiverPostingId,
                formik.props.comment != null ? formik.props.comment.id : null,
                commentText,
                commentSourceText
            ));
        }
        formik.setSubmitting(false);
    }

};
