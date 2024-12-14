import { fromUnixTime, getUnixTime, isEqual } from 'date-fns';
import { FormikBag } from 'formik';
import deepEqual from 'react-fast-compare';

import {
    AvatarImage,
    CLIENT_SETTINGS_PREFIX,
    FeedReference,
    PostingFeatures,
    PostingInfo,
    PostingText,
    PrincipalValue,
    PrivateMediaFileInfo,
    SourceFormat,
    StoryAttributes
} from "api";
import store from "state/store";
import { composePost } from "state/compose/actions";
import { DraftPostingInfo, ExtDraftInfo } from "state/compose/state";
import { settingsUpdate } from "state/settings/actions";
import { bodyToLinkPreviews, RichTextLinkPreviewsValue, RichTextValue } from "ui/control/richtexteditor";
import { Scripture } from "ui/control/richtexteditor/visual/scripture";
import { toScripture } from "ui/control/richtexteditor/visual/scripture-util";
import { replaceSmileys } from "util/text";
import { quoteHtml, safeImportHtml } from "util/html";

export type ComposePageToolsTab = null | "format" | "comments" | "reactions" | "updated";

export interface ValuesToPostingTextProps {
    gender: string | null;
    postingId: string | null;
    features: PostingFeatures | null;
    smileysEnabled: boolean;
    newsFeedEnabled: boolean;
    avatarShapeDefault: string;
}

export interface ComposePageProps extends ValuesToPostingTextProps {
    avatarDefault: AvatarImage | null;
    fullNameDefault: string | null;
    posting: DraftPostingInfo | null;
    draft: ExtDraftInfo | null;
    sharedText: string | null;
    sharedTextType: SharedTextType | null,
    visibilityDefault: PrincipalValue,
    commentsVisibilityDefault: PrincipalValue,
    commentAdditionDefault: PrincipalValue,
    commentsHideDefault: boolean,
    reactionsEnabledDefault: boolean,
    reactionsNegativeEnabledDefault: boolean,
    reactionsPositiveDefault: string,
    reactionsNegativeDefault: string,
    reactionsVisibleDefault: boolean,
    reactionTotalsVisibleDefault: boolean,
    sourceFormatDefault: SourceFormat
}

export interface ComposePageValues {
    avatar: AvatarImage | null;
    fullName: string | null;
    subject: string | null;
    body: RichTextValue;
    bodyUrls: string[];
    linkPreviews: RichTextLinkPreviewsValue;
    bodyFormat: SourceFormat;
    viewPrincipal: PrincipalValue;
    publishAtDefault: Date;
    publishAt: Date;
    toolsTab: ComposePageToolsTab;
    viewCommentsPrincipal: PrincipalValue;
    viewCommentsPrincipalDefault: PrincipalValue;
    addCommentPrincipal: PrincipalValue;
    addCommentPrincipalDefault: PrincipalValue;
    hideComments: boolean;
    hideCommentsDefault: boolean;
    reactionsEnabled: boolean;
    reactionsEnabledDefault: boolean;
    reactionsNegativeEnabled: boolean;
    reactionsNegativeEnabledDefault: boolean;
    reactionsPositiveDefault: string;
    reactionsPositive: string;
    reactionsNegativeDefault: string;
    reactionsNegative: string;
    reactionsVisibleDefault: boolean;
    reactionsVisible: boolean;
    reactionTotalsVisibleDefault: boolean;
    reactionTotalsVisible: boolean;
    updateImportant: boolean;
    updateDescription: string;
}

const getPublishAt = (publications: FeedReference[] | null | undefined): Date | null =>
    publications != null && publications.length > 0 ? fromUnixTime(publications[0].publishedAt) : null;

function getSharedText(props: ComposePageProps, format: SourceFormat): string {
    let content;
    if (props.sharedTextType === "html") {
        content = safeImportHtml(props.sharedText);
        if (format === "markdown") {
            content = quoteHtml(content);
        }
    } else {
        content = props.sharedText;
    }
    return content ?? "";
}

const replaceSmileysIfNeeded = (enabled: boolean, text: string): string =>
    (enabled ? replaceSmileys(text) : text).trim();

function buildPublications(values: ComposePageValues, props: ValuesToPostingTextProps): StoryAttributes[] | null {
    if (props.postingId != null) {
        return null;
    }
    const publishAt = !isEqual(values.publishAt, values.publishAtDefault) ? getUnixTime(values.publishAt) : null;
    const publications: StoryAttributes[] = [{feedName: "timeline", publishAt, viewed: true, read: true}];
    if (props.newsFeedEnabled) {
        publications.push({feedName: "news", publishAt, viewed: true, read: true});
    }
    return publications;
}

export const valuesToPostingText = (values: ComposePageValues, props: ValuesToPostingTextProps): PostingText => ({
    ownerFullName: values.fullName,
    ownerGender: props.gender,
    ownerAvatar: values.avatar ? {
        mediaId: values.avatar.mediaId,
        shape: values.avatar.shape ?? props.avatarShapeDefault
    } : null,
    bodySrc: JSON.stringify({
        subject: props.features?.subjectPresent
            ? replaceSmileysIfNeeded(props.smileysEnabled, values.subject ?? "")
            : null,
        text: values.body.toString(props.smileysEnabled),
        linkPreviews: values.linkPreviews.previews
    }),
    bodySrcFormat: values.bodyFormat,
    media: (values.body.orderedMediaList() ?? []).concat(values.linkPreviews.media.map(vm => vm.id)),
    acceptedReactions: {positive: values.reactionsPositive, negative: values.reactionsNegative},
    publications: buildPublications(values, props),
    updateInfo: {
        important: values.updateImportant,
        description: values.updateDescription
    },
    operations: {
        view: values.viewPrincipal,
        viewComments: values.viewCommentsPrincipal,
        addComment: values.addCommentPrincipal,
        viewReactions: values.reactionsEnabled ? (values.reactionsVisible ? "public" : "private") : "none",
        viewNegativeReactions: values.reactionsEnabled && values.reactionsNegativeEnabled
            ? (values.reactionsVisible ? "public" : "private")
            : "none",
        viewReactionTotals: values.reactionsEnabled
            ? (values.reactionsVisible || values.reactionTotalsVisible ? "public" : "private")
            : "none",
        viewNegativeReactionTotals: values.reactionsEnabled && values.reactionsNegativeEnabled
            ? (values.reactionsVisible || values.reactionTotalsVisible ? "public" : "private")
            : "none",
        viewReactionRatios: values.reactionsEnabled ? "public" : "none",
        viewNegativeReactionRatios: values.reactionsEnabled && values.reactionsNegativeEnabled
            ? "public"
            : "none",
        addReaction: values.reactionsEnabled ? "signed" : "none",
        addNegativeReaction: values.reactionsEnabled && values.reactionsNegativeEnabled ? "signed" : "none"
    },
    commentOperations: {
        view: values.hideComments ? "private" : "unset"
    }
});

function isPostingContentEmpty(
    subject: string | null | undefined,
    text: string | null | undefined,
    media: (PrivateMediaFileInfo | null)[] | string[] | null | undefined
): boolean {
    const textEmpty = (!subject || subject.trim() === "") && (!text || text.trim() === "<p></p>");
    const mediaEmpty = media == null || media.length === 0;
    return textEmpty && mediaEmpty;
}

export const areValuesEmpty = (values: ComposePageValues): boolean =>
    isPostingContentEmpty(values.subject, values.body.text, values.body.media);

export const areImagesUploaded = (values: ComposePageValues): boolean =>
    values.body.media == null || values.body.media.every(media => media != null);

function isPostingTextEmpty(postingText: PostingText): boolean {
    const {subject, text} = postingText.bodySrc != null ? JSON.parse(postingText.bodySrc) : {subject: null, text: null};
    return isPostingContentEmpty(subject, text, postingText.media);
}

export function isPostingTextChanged(postingText: PostingText, posting: PostingInfo | null) {
    if (posting == null) {
        return !isPostingTextEmpty(postingText);
    }
    if (postingText.bodySrc == null || posting.bodySrc == null) {
        return (postingText.bodySrc == null) !== (posting.bodySrc == null);
    }
    const {subject, text, linkPreviews} = JSON.parse(postingText.bodySrc);
    const {subject: prevSubject, text: prevText, linkPreviews: prevLinkPreviews} = posting.bodySrc;
    if (subject !== prevSubject || text !== prevText || !deepEqual(linkPreviews ?? [], prevLinkPreviews ?? [])) {
        return true;
    }
    const media = postingText.media ?? [];
    const prevMedia = posting.media != null ? posting.media.map(ma => ma.media?.id ?? ma.remoteMedia?.id) : [];
    if (!deepEqual(media, prevMedia)) {
        return true;
    }
    const prevOperations = {
        view: posting.operations?.view ?? "public",
        viewComments: posting.operations?.viewComments ?? "public",
        addComment: posting.operations?.addComment ?? "signed",
        viewReactions: posting.operations?.viewReactions ?? "public",
        viewNegativeReactions: posting.operations?.viewNegativeReactions ?? "public",
        viewReactionTotals: posting.operations?.viewReactionTotals ?? "public",
        viewNegativeReactionTotals: posting.operations?.viewNegativeReactionTotals ?? "public",
        viewReactionRatios: posting.operations?.viewReactionRatios ?? "public",
        viewNegativeReactionRatios: posting.operations?.viewNegativeReactionRatios ?? "public",
        addReaction: posting.operations?.addReaction ?? "signed",
        addNegativeReaction: posting.operations?.addNegativeReaction ?? "signed"
    }
    return !deepEqual(postingText.operations, prevOperations);
}

export const composePageLogic = {

    // Note that this == undefined, when called from Formik
    mapPropsToValues(props: ComposePageProps): ComposePageValues {
        const avatar = props.draft != null
            ? props.draft.ownerAvatar ?? null
            : props.posting != null ? props.posting.ownerAvatar ?? null : props.avatarDefault;
        const fullName = props.draft != null
            ? props.draft.ownerFullName ?? null
            : props.posting != null ? props.posting.ownerFullName ?? null : props.fullNameDefault;
        const subject = props.draft != null
            ? props.draft.bodySrc?.subject ?? ""
            : props.posting != null ? props.posting.bodySrc?.subject ?? "" : "";
        const bodyFormat = props.draft != null
            ? props.draft.bodySrcFormat ?? "markdown"
            : props.posting != null ? props.posting.bodySrcFormat ?? "markdown" : props.sourceFormatDefault;
        let body: string | Scripture;
        body = props.draft != null
            ? props.draft.bodySrc?.text ?? ""
            : props.posting != null
                ? props.posting.bodySrc?.text ?? ""
                : props.sharedText != null ? getSharedText(props, bodyFormat) : "";
        if (bodyFormat === "html/visual") {
            body = toScripture(body);
        }
        const attachments = props.draft != null ? props.draft.media : props.posting?.media;
        let media = attachments != null
            ? attachments.map(ma => ma.media ?? null).filter((mf): mf is PrivateMediaFileInfo => mf != null)
            : [];

        const linkPreviewsInfo = props.draft != null
            ? props.draft.bodySrc?.linkPreviews ?? []
            : props.posting != null ? props.posting.bodySrc?.linkPreviews ?? [] : [];
        let linkPreviews, bodyUrls;
        [linkPreviews, bodyUrls, media] = bodyToLinkPreviews(body, linkPreviewsInfo, media);

        const viewPrincipal = props.draft != null
            ? props.draft.operations?.view ?? "public"
            : props.posting != null
                ? props.posting.operations?.view ?? "public"
                : props.visibilityDefault;
        const publishAtDefault = new Date();
        const publishAt = props.draft != null
            ? (props.draft.publishAt != null ? fromUnixTime(props.draft.publishAt) : publishAtDefault)
            : props.posting != null
                ? getPublishAt(props.posting.feedReferences) ?? publishAtDefault
                : publishAtDefault;
        const viewCommentsPrincipal = props.draft != null
            ? props.draft.operations?.viewComments ?? "public"
            : props.posting != null
                ? props.posting.operations?.viewComments ?? "public"
                : props.commentsVisibilityDefault;
        const addCommentPrincipal = props.draft != null
            ? props.draft.operations?.addComment ?? "signed"
            : props.posting != null
                ? props.posting.operations?.addComment ?? "signed"
                : props.commentAdditionDefault;
        const hideComments = props.draft != null
            ? (props.draft.commentOperations?.view ?? "public") === "private" ?? props.commentsHideDefault
            : props.posting != null
                ? (props.posting.commentOperations?.view ?? "public") === "private"
                : props.commentsHideDefault;
        const reactionsEnabled = props.draft != null
            ? (props.draft.operations?.addReaction ?? "signed") !== "none"
            : props.posting != null
                ? (props.posting.operations?.addReaction ?? "signed") !== "none"
                : props.reactionsEnabledDefault;
        const reactionsNegativeEnabled = props.draft != null
            ? (props.draft.operations?.addNegativeReaction ?? "signed") !== "none"
            : props.posting != null
                ? (props.posting.operations?.addNegativeReaction ?? "signed") !== "none"
                : props.reactionsNegativeEnabledDefault;
        const reactionsPositive = props.draft != null
            ? props.draft.acceptedReactions?.positive ?? ""
            : props.posting != null
                ? props.posting.acceptedReactions?.positive ?? ""
                : props.reactionsPositiveDefault;
        const reactionsNegative = props.draft != null
            ? props.draft.acceptedReactions?.negative ?? ""
            : props.posting != null
                ? props.posting.acceptedReactions?.negative ?? ""
                : props.reactionsNegativeDefault;
        const reactionsVisible = props.draft != null
            ? (props.draft.operations?.viewReactions ?? "public") === "public"
            : props.posting != null
                ? (props.posting.operations?.viewReactions ?? "public") === "public"
                : props.reactionsVisibleDefault;
        const reactionTotalsVisible = props.draft != null
            ? (props.draft.operations?.viewReactionTotals ?? "public") === "public"
            : props.posting != null
                ? (props.posting.operations?.viewReactionTotals ?? "public") === "public"
                : props.reactionTotalsVisibleDefault;
        const updateImportant = props.draft != null ? props.draft.updateInfo?.important ?? false : false;
        const updateDescription = props.draft != null ? props.draft.updateInfo?.description ?? "" : "";

        return {
            avatar,
            fullName,
            subject,
            body: new RichTextValue(body, bodyFormat, media),
            bodyUrls,
            linkPreviews,
            bodyFormat,
            viewPrincipal,
            publishAtDefault,
            publishAt,
            toolsTab: null,
            viewCommentsPrincipal,
            viewCommentsPrincipalDefault: viewCommentsPrincipal,
            addCommentPrincipal,
            addCommentPrincipalDefault: addCommentPrincipal,
            hideComments,
            hideCommentsDefault: hideComments,
            reactionsEnabled,
            reactionsEnabledDefault: reactionsEnabled,
            reactionsNegativeEnabled,
            reactionsNegativeEnabledDefault: reactionsNegativeEnabled,
            reactionsPositiveDefault: reactionsPositive,
            reactionsPositive,
            reactionsNegativeDefault: reactionsNegative,
            reactionsNegative,
            reactionsVisibleDefault: reactionsVisible,
            reactionsVisible,
            reactionTotalsVisibleDefault: reactionTotalsVisible,
            reactionTotalsVisible,
            updateImportant,
            updateDescription
        };
    },

    handleSubmit(values: ComposePageValues, formik: FormikBag<ComposePageProps, ComposePageValues>): void {
        formik.setStatus("submitted");
        store.dispatch(composePost(
            formik.props.postingId,
            valuesToPostingText(values, formik.props),
            {hideComments: values.hideCommentsDefault}
        ));
        let settings = [];
        if (values.bodyFormat.trim() !== formik.props.sourceFormatDefault) {
            settings.push({
                name: CLIENT_SETTINGS_PREFIX + "posting.body-src-format.default",
                value: values.bodyFormat.trim()
            });
        }
        if (settings.length > 0) {
            store.dispatch(settingsUpdate(settings));
        }

        formik.setSubmitting(false);
    }

};
