import { fromUnixTime, getUnixTime, isEqual } from 'date-fns';
import { FormikBag } from 'formik';
import deepEqual from 'react-fast-compare';

import { ClientSettings } from "api";
import {
    AvatarImage,
    FeedReference,
    PostingFeatures,
    PostingInfo,
    PostingText,
    PrivateMediaFileInfo,
    SourceFormat,
    StoryAttributes
} from "api/node/api-types";
import { RichTextValue } from "ui/control";
import { RichTextLinkPreviewsStatus, RichTextLinkPreviewsValue } from "ui/control/richtexteditor/RichTextLinkPreviews";
import { ComposePageOuterProps } from "ui/compose/ComposePage";
import { extractUrls, replaceSmileys } from "util/text";
import { quoteHtml, safeImportHtml } from "util/html";

export interface ComposePageValues {
    avatar: AvatarImage | null;
    fullName: string | null;
    subject: string | null;
    body: RichTextValue;
    bodyUrls: string[];
    linkPreviews: RichTextLinkPreviewsValue;
    bodyFormatVisible: boolean;
    bodyFormat: SourceFormat;
    publishAtDefault: Date;
    publishAt: Date;
    reactionVisible: boolean;
    reactionsPositiveDefault: string;
    reactionsPositive: string;
    reactionsNegativeDefault: string;
    reactionsNegative: string;
    reactionsVisibleDefault: boolean;
    reactionsVisible: boolean;
    reactionTotalsVisibleDefault: boolean;
    reactionTotalsVisible: boolean;
    updateInfoVisible: boolean;
    updateImportant: boolean;
    updateDescription: string;
}

export interface MapToPostingTextProps {
    postingId: string | null;
    features: PostingFeatures | null;
    smileysEnabled: boolean;
    newsFeedEnabled: boolean;
    avatarShapeDefault: string;
}

const composePageLogic = {

    // Note that this == undefined, when called from Formik
    mapPropsToValues(props: ComposePageOuterProps): ComposePageValues {
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
        const body = props.draft != null
            ? props.draft.bodySrc?.text ?? ""
            : props.posting != null
                ? props.posting.bodySrc?.text ?? ""
                : props.sharedText != null ? composePageLogic._getSharedText(props, bodyFormat) : "";
        const attachments = props.draft != null ? props.draft.media : props.posting?.media;
        let media = attachments != null
            ? attachments.map(ma => ma.media ?? null).filter((mf): mf is PrivateMediaFileInfo => mf != null)
            : [];

        const bodyUrls = extractUrls(body);
        const linkPreviewsInfo = props.draft != null
            ? props.draft.bodySrc?.linkPreviews ?? []
            : props.posting != null ? props.posting.bodySrc?.linkPreviews ?? [] : [];
        const linkPreviewsUrls = new Set(linkPreviewsInfo.map(lp => lp.url));
        const linkPreviewsImages = new Set(
            linkPreviewsInfo.map(lp => lp.imageHash).filter((ih): ih is string => ih != null)
        );
        const linkPreviewsStatus: RichTextLinkPreviewsStatus = {};
        for (const url of bodyUrls) {
            linkPreviewsStatus[url] = linkPreviewsUrls.has(url) ? "edited" : "deleted";
        }
        const linkPreviews = {
            previews: linkPreviewsInfo,
            media: media.filter(mf => linkPreviewsImages.has(mf.hash)),
            status: linkPreviewsStatus
        };
        media = media.filter(mf => !linkPreviewsImages.has(mf.hash));

        const publishAtDefault = new Date();
        const publishAt = props.draft != null
            ? (props.draft.publishAt != null ? fromUnixTime(props.draft.publishAt) : publishAtDefault)
            : props.posting != null
                ? composePageLogic._getPublishAt(props.posting.feedReferences) ?? publishAtDefault
                : publishAtDefault;
        const reactionsPositive = props.draft != null
            ? props.draft.acceptedReactions?.positive ?? ""
            : props.posting != null ? props.posting.acceptedReactions?.positive ?? "" : props.reactionsPositiveDefault;
        const reactionsNegative = props.draft != null
            ? props.draft.acceptedReactions?.negative ?? ""
            : props.posting != null ? props.posting.acceptedReactions?.negative ?? "" : props.reactionsNegativeDefault;
        const reactionsVisible = props.draft != null
            ? props.draft.reactionsVisible ?? true
            : props.posting != null ? props.posting.reactionsVisible ?? true : props.reactionsVisibleDefault;
        const reactionTotalsVisible = props.draft != null
            ? props.draft.reactionTotalsVisible ?? true
            : props.posting != null ? props.posting.reactionTotalsVisible ?? true : props.reactionTotalsVisibleDefault;
        const updateImportant = props.draft != null ? props.draft.updateInfo?.important ?? false : false;
        const updateDescription = props.draft != null ? props.draft.updateInfo?.description ?? "" : "";

        return {
            avatar,
            fullName,
            subject,
            body: new RichTextValue(body, media),
            bodyUrls,
            linkPreviews,
            bodyFormatVisible: false,
            bodyFormat,
            publishAtDefault,
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

    _getPublishAt: (publications: FeedReference[] | null | undefined): Date | null =>
        publications != null && publications.length > 0 ? fromUnixTime(publications[0].publishedAt) : null,

    _getSharedText(props: ComposePageOuterProps, format: SourceFormat): string {
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
    },

    _replaceSmileys(enabled: boolean, text: string): string {
        return enabled ? replaceSmileys(text) : text;
    },

    _buildPublications(values: ComposePageValues, props: MapToPostingTextProps): StoryAttributes[] | null {
        if (props.postingId != null) {
            return null;
        }
        const publishAt = !isEqual(values.publishAt, values.publishAtDefault) ? getUnixTime(values.publishAt) : null;
        const publications: StoryAttributes[] = [{feedName: "timeline", publishAt, viewed: true, read: true}];
        if (props.newsFeedEnabled) {
            publications.push({feedName: "news", publishAt, viewed: true, read: true});
        }
        return publications;
    },

    mapValuesToPostingText(values: ComposePageValues, props: MapToPostingTextProps): PostingText {
        return {
            ownerFullName: values.fullName,
            ownerAvatar: values.avatar ? {
                mediaId: values.avatar.mediaId,
                shape: values.avatar.shape ?? props.avatarShapeDefault
            } : null,
            bodySrc: JSON.stringify({
                subject: props.features?.subjectPresent
                    ? this._replaceSmileys(props.smileysEnabled, values.subject?.trim() ?? "")
                    : null,
                text: this._replaceSmileys(props.smileysEnabled, values.body.text.trim()),
                linkPreviews: values.linkPreviews.previews
            }),
            bodySrcFormat: values.bodyFormat,
            media: (values.body.orderedMediaList() ?? []).concat(values.linkPreviews.media.map(vm => vm.id)),
            acceptedReactions: {positive: values.reactionsPositive, negative: values.reactionsNegative},
            reactionsVisible: values.reactionsVisible,
            reactionTotalsVisible: values.reactionTotalsVisible,
            publications: this._buildPublications(values, props),
            updateInfo: {
                important: values.updateImportant,
                description: values.updateDescription
            }
        };
    },

    areValuesEmpty(values: ComposePageValues): boolean {
        return (values.subject == null || values.subject.trim() === "")
            && values.body.text.trim() === ""
            && (values.body.media == null || values.body.media.length === 0);
    },

    areImagesUploaded(values: ComposePageValues): boolean {
        return values.body.media == null || values.body.media.every(media => media != null);
    },

    isPostingTextEmpty(postingText: PostingText): boolean {
        let textEmpty = postingText.bodySrc == null;
        if (!textEmpty) {
            const {subject, text} = JSON.parse(postingText.bodySrc);
            textEmpty = !subject && !text;
        }
        const mediaEmpty = postingText.media == null || postingText.media.length === 0;
        return textEmpty && mediaEmpty;
    },

    isPostingTextChanged(postingText: PostingText, posting: PostingInfo | null) {
        if (posting == null) {
            return !this.isPostingTextEmpty(postingText);
        }
        if (postingText.bodySrc == null || posting.bodySrc == null) {
            return (postingText.bodySrc == null) !== (posting.bodySrc == null);
        }
        const {subject, text} = JSON.parse(postingText.bodySrc);
        const {subject: prevSubject, text: prevText} = posting.bodySrc;
        if (subject !== prevSubject || text !== prevText) {
            return true;
        }
        const media = postingText.media ?? [];
        const prevMedia = posting.media != null ? posting.media.map(ma => ma.media?.id ?? ma.remoteMedia?.id) : [];
        return !deepEqual(media, prevMedia);
    },

    handleSubmit(values: ComposePageValues, formik: FormikBag<ComposePageOuterProps, ComposePageValues>): void {
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
