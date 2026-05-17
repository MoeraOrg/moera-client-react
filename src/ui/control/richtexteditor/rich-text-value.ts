import {
    MediaAttachment,
    MediaCaption,
    MediaCaptionText,
    MediaToAttach,
    PrivateMediaFileInfo,
    RemoteMedia,
    RemoteMediaInfo,
    SourceFormat
} from "api";
import { Scripture } from "ui/control/richtexteditor/visual/scripture";
import { htmlToScripture, scriptureToHtml } from "ui/control/richtexteditor/visual/scripture-html";
import { LeasedRemoteMediaInfo, MediaWithCaption } from "util/media-with-caption";
import { mediaHashesExtract } from "util/media-images";
import { replaceSmileys } from "util/text";
import { notNull } from "util/misc";

export class RichTextValue {

    readonly format: SourceFormat;
    readonly value: string | Scripture;
    readonly media?: (MediaWithCaption | null)[] | null;

    constructor(value: string | Scripture, format: SourceFormat, media?: (MediaWithCaption | null)[] | null) {
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

    orderedMediaList(): MediaWithCaption[] | null {
        if (this.media == null) {
            return null;
        }

        const bodyMedia = this.media.filter(notNull);
        const mediaMap = new Map(bodyMedia.map(mf => [mf.hash, mf]));
        const embeddedHashes = mediaHashesExtract(this.value);

        return [...embeddedHashes]
            .map(hash => mediaMap.get(hash))
            .filter(notNull)
            .concat(bodyMedia.filter(mf => !embeddedHashes.has(mf.hash ?? "")))
    }

}

function remoteMediaInfoToRemoteMedia(info: LeasedRemoteMediaInfo | null | undefined): RemoteMedia | undefined {
    if (info == null) {
        return undefined;
    }

    return {
        nodeName: info.nodeName,
        mediaId: info.mediaId,
        hash: info.hash ?? "",
        digest: info.digest ?? "",
        mimeType: info.mimeType ?? "image/jpeg",
        width: info.width,
        height: info.height,
        size: info.size ?? 0,
        title: info.title,
        attachment: info.attachment,
        leaseId: info.leaseId,
    };
}

function localMediaToRemoteMedia(
    info: PrivateMediaFileInfo | null | undefined, nodeName: string, leaseId?: string | null
): RemoteMedia | undefined {
    if (info == null) {
        return undefined;
    }

    return {
        nodeName,
        mediaId: info.id,
        hash: info.hash,
        digest: info.digest,
        mimeType: info.mimeType,
        width: info.width,
        height: info.height,
        size: info.size,
        title: info.title,
        attachment: info.attachment,
        leaseId,
    };
}

export function localMediaToLeasedRemoteMediaInfo(
    info: PrivateMediaFileInfo | null | undefined, nodeName: string, leaseId: string | null | undefined
): LeasedRemoteMediaInfo | undefined {
    if (info == null) {
        return undefined;
    }

    return {
        nodeName,
        mediaId: info.id,
        hash: info.hash,
        digest: info.digest,
        mimeType: info.mimeType,
        width: info.width,
        height: info.height,
        size: info.size,
        title: info.title,
        attachment: info.attachment,
        leaseId: leaseId ?? undefined,
    };
}

export function attachmentsToMedia(attachments: MediaAttachment[] | null | undefined): MediaWithCaption[] {
    if (attachments == null) {
        return [];
    }

    return attachments
        .map(ma =>
            new MediaWithCaption(
                ma.media ?? undefined,
                ma.remoteMedia ?? undefined,
                ma.postingId ?? undefined
            )
        );
}

export function draftAttachmentsToMedia(
    draftAttachments: MediaAttachment[] | null | undefined,
    attachments: MediaAttachment[] | null | undefined,
    captions: MediaCaption[] | null,
    targetNodeName: string | null,
    homeOwnerName: string
): MediaWithCaption[] {
    if (draftAttachments == null) {
        return [];
    }

    const localMedia = attachments != null
        ? new Map(attachments.map(a => a.media).filter(notNull).map(m => [m.id, m]))
        : null;
    const captionPostingIdsByMediaId = attachments != null
        ? new Map(
            attachments
                .map(a => [a.media?.id ?? a.remoteMedia?.mediaId, a.postingId])
                .filter((a): a is [string, string | null | undefined] => a[0] != null)
        )
        : null;
    const captionsByMediaId = captions != null ? new Map(captions.map(caption => [caption.mediaId, caption])) : null;

    const media = draftAttachments
        .map((ma): [MediaAttachment, string] => [ma, ma.media?.id ?? ma.remoteMedia?.mediaId ?? ""])
        .map(([ma, mediaId]): [
            PrivateMediaFileInfo | undefined,
            string | null | undefined,
            RemoteMediaInfo | undefined,
            string | undefined,
            MediaCaption | undefined
        ] => [
            ma.media ?? undefined,
            ma.mediaLeaseId,
            ma.remoteMedia ?? undefined,
            captionPostingIdsByMediaId?.get(mediaId) ?? undefined,
            captionsByMediaId?.get(mediaId)
        ]);

    if (targetNodeName === homeOwnerName) {
        return media
            .map(([media, _, remoteMedia, captionPostingId, caption]) =>
                new MediaWithCaption(media, remoteMedia, captionPostingId, caption)
            );
    } else {
        return media
            .map(([media, mediaLeaseId, remoteMedia, captionPostingId, caption]) =>
                new MediaWithCaption(
                    remoteMedia?.nodeName === targetNodeName
                        ? localMedia?.get(remoteMedia.mediaId)
                        : undefined,
                    media != null
                        ? localMediaToRemoteMedia(media, homeOwnerName, mediaLeaseId)
                        : remoteMedia ?? undefined,
                    captionPostingId,
                    caption
                )
            );
    }
}

export function mediaToAttachment(media: MediaWithCaption): MediaToAttach {
    return {
        localMediaId: media.localMedia?.id,
        remoteMedia: remoteMediaInfoToRemoteMedia(media.remoteMedia)
    };
}

export function mediaToDraftAttachment(
    media: MediaWithCaption, targetNodeName: string, homeOwnerName: string
): MediaToAttach {
    if (targetNodeName === homeOwnerName) {
        return mediaToAttachment(media);
    }

    return {
        localMediaId: media.remoteMedia?.nodeName === homeOwnerName ? media.remoteMedia.mediaId : undefined,
        localMediaLeaseId: media.remoteMedia?.nodeName === homeOwnerName ? media.remoteMedia.leaseId : undefined,
        remoteMedia: localMediaToRemoteMedia(media.localMedia, targetNodeName)
    };
}

export function mediaToCaptions(
    media: (MediaWithCaption | null)[] | null | undefined
): Record<string, MediaCaption> {
    if (media == null) {
        return {};
    }

    const captions: Record<string, MediaCaption> = {};
    for (const mf of media) {
        if (mf?.caption != null) {
            captions[mf.caption.mediaId] = {...mf.caption, mediaId: mf.caption.mediaId};
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

export function mediaToCaptionsText(
    media: (MediaWithCaption | null)[] | null | undefined
): MediaCaptionText[] | undefined {
    return mediaCaptionsToCaptionsText(Object.values(mediaToCaptions(media)));
}
