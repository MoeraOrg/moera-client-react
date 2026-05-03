import { MediaAttachment, MediaCaption, MediaCaptionText, MediaWithDigest, SourceFormat, VerifiedMediaFile } from "api";
import { Scripture } from "ui/control/richtexteditor/visual/scripture";
import { htmlToScripture, scriptureToHtml } from "ui/control/richtexteditor/visual/scripture-html";
import { mediaHashesExtract } from "util/media-images";
import { replaceSmileys } from "util/text";
import { notNull } from "util/misc";

export interface MediaFileWithCaption extends VerifiedMediaFile {
    captionPostingId: string | null;
    caption?: MediaCaption;
}

export class RichTextValue {

    readonly format: SourceFormat;
    readonly value: string | Scripture;
    readonly media?: (MediaFileWithCaption | null)[] | null;

    constructor(value: string | Scripture, format: SourceFormat, media?: (MediaFileWithCaption | null)[] | null) {
        if (format === "html/visual") {
            value = htmlToScripture(value, false, media?.filter(notNull));
        }
        this.format = format;
        this.value = value;
        this.media = media;
    }

    get text(): string {
        return typeof this.value !== "string" ? scriptureToHtml(this.value) : this.value;
    }

    get scripture(): Scripture {
        return typeof this.value !== "string"
            ? this.value
            : htmlToScripture(this.value, false, this.media?.filter(notNull));
    }

    toText(smileysEnabled: boolean = false): string {
        const value = smileysEnabled ? replaceSmileys(this.value) : this.value;
        return typeof value !== "string" ? scriptureToHtml(value) : value.trim();
    }

    orderedMediaListWithDigests(): MediaWithDigest[] | null {
        if (this.media == null) {
            return null;
        }

        const bodyMedia = this.media.filter(notNull);
        const mediaMap = new Map(bodyMedia.map(mf => [mf.hash, mf]));
        const embeddedHashes = mediaHashesExtract(this.value);

        return [...embeddedHashes]
            .map(hash => mediaMap.get(hash))
            .filter(notNull)
            .concat(bodyMedia.filter(mf => !embeddedHashes.has(mf.hash)))
            .map(media => ({id: media.id, digest: media.digest}));
    }

    orderedMediaList(): string[] | null {
        const list = this.orderedMediaListWithDigests();
        return list != null ? list.map(md => md.id) : null;
    }

}

export function attachmentsToMedia(
    attachments: MediaAttachment[] | null | undefined,
    captions?: MediaCaption[] | null
): MediaFileWithCaption[] {
    if (attachments == null) {
        return [];
    }

    const captionsByMediaId = captions != null ? new Map(captions.map(caption => [caption.mediaId, caption])) : null;

    return attachments
        .map(ma =>
            ma.media?.id != null
                ? {
                    ...ma.media,
                    digest: ma.remoteMedia?.digest,
                    captionPostingId: ma.postingId ?? null,
                    caption: captionsByMediaId?.get(ma.media.id)
                }
                : null
        )
        .filter(notNull);
}

export function mediaToCaptions(
    media: (MediaFileWithCaption | null)[] | null | undefined
): Record<string, MediaCaption> {
    if (media == null) {
        return {};
    }

    const captions: Record<string, MediaCaption> = {};
    for (const mf of media) {
        if (mf?.caption != null) {
            captions[mf.id] = {...mf.caption, mediaId: mf.caption.mediaId ?? mf.id};
        }
    }

    return captions;
}

export function mediaCaptionsToCaptionsText(
    captions: MediaCaption[] | null | undefined
): MediaCaptionText[] | undefined {
    if (captions == null) {
        return undefined;
    }

    return captions.map(c =>
        ({
            mediaId: c.mediaId,
            captionSrc: c.captionSrc != null ? JSON.stringify(c.captionSrc) : undefined,
            captionSrcFormat: c.captionSrcFormat
        })
    );
}
