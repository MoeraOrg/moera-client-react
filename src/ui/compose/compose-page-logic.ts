import { fromUnixTime, getUnixTime, isEqual } from 'date-fns';
import { FormikBag } from 'formik';

import { ClientSettings } from "api";
import { AvatarImage, PostingText, PrivateMediaFileInfo, SourceFormat, StoryAttributes } from "api/node/api-types";
import { RichTextValue } from "ui/control";
import { ComposePageOuterProps } from "ui/compose/ComposePage";
import { replaceSmileys } from "util/text";
import { quoteHtml, safeImportHtml } from "util/html";

export interface ComposePageValues {
    avatar: AvatarImage | null;
    fullName: string | null;
    subject: string | null;
    body: RichTextValue;
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
    subjectPresent: boolean;
    smileysEnabled: boolean;
    newsFeedEnabled: boolean;
    avatarShapeDefault: string;
}

const composePageLogic = {

    mapPropsToValues(props: ComposePageOuterProps): ComposePageValues {
        const avatar = props.posting != null ? (props.posting.ownerAvatar ?? null) : props.avatarDefault;
        const fullName = props.posting != null ? (props.posting.ownerFullName ?? null) : props.fullNameDefault;
        const subject = props.posting != null ? (props.posting.bodySrc?.subject ?? "") : "";
        const bodyFormat = props.posting != null
            ? (props.posting.bodySrcFormat ?? "markdown")
            : props.sourceFormatDefault;
        const body = props.posting != null
            ? (props.posting.bodySrc?.text ?? "")
            : (props.sharedText != null ? composePageLogic._getSharedText(props, bodyFormat) : "");
        const media = props.posting != null && props.posting.media != null
            ? props.posting.media.map(mf => mf.media)
            : [];
        const publishAtDefault = new Date();
        const publishAt = props.draftId != null && props.posting?.publishAt != null
            ? fromUnixTime(props.posting?.publishAt) : publishAtDefault;
        const reactionsPositive = props.posting != null
            ? (props.posting.acceptedReactions?.positive ?? "") : props.reactionsPositiveDefault;
        const reactionsNegative = props.posting != null
            ? (props.posting.acceptedReactions?.negative ?? "") : props.reactionsNegativeDefault;
        const reactionsVisible = props.posting != null
            ? (props.posting.reactionsVisible ?? true) : props.reactionsVisibleDefault;
        const reactionTotalsVisible = props.posting != null
            ? (props.posting.reactionTotalsVisible ?? true) : props.reactionTotalsVisibleDefault;
        const updateImportant = props.draftId != null
            ? (props.posting?.updateInfo?.important ?? false): false;
        const updateDescription = props.draftId != null
            ? (props.posting?.updateInfo?.description ?? ""): "";

        return {
            avatar,
            fullName,
            subject,
            body: new RichTextValue(body, media),
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

    getPublishAt: (publications: StoryAttributes[] | null | undefined): number | null | undefined =>
        publications != null && publications.length > 0 ? publications[0].publishAt : null,

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
                subject: props.subjectPresent
                    ? this._replaceSmileys(props.smileysEnabled, values.subject?.trim() ?? "")
                    : null,
                text: this._replaceSmileys(props.smileysEnabled, values.body.text.trim())
            }),
            bodySrcFormat: values.bodyFormat,
            media: values.body.media != null
                ? values.body.media.filter((mf): mf is PrivateMediaFileInfo => mf != null).map(mf => mf.id)
                : null,
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

    isPostingTextEmpty(postingText: PostingText): boolean {
        let textEmpty = postingText.bodySrc == null;
        if (!textEmpty) {
            const {subject, text} = JSON.parse(postingText.bodySrc);
            textEmpty = !subject && !text;
        }
        const mediaEmpty = postingText.media == null || postingText.media.length === 0;
        return textEmpty && mediaEmpty;
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
