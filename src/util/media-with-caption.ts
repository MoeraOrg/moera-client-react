import cloneDeep from 'lodash.clonedeep';

import { MediaCaption, PrivateMediaFileInfo, RemoteMediaInfo } from "api";
import { extension } from "util/mime-type";

export type LeasedRemoteMediaInfo = Omit<RemoteMediaInfo, "id"> & { id?: string, leaseId?: string | null };

export class MediaWithCaption {

    localMedia?: PrivateMediaFileInfo;
    remoteMedia?: LeasedRemoteMediaInfo;
    captionPostingId?: string;
    caption?: MediaCaption;

    constructor(
        localMedia?: PrivateMediaFileInfo,
        remoteMedia?: LeasedRemoteMediaInfo,
        captionPostingId?: string,
        caption?: MediaCaption
    ) {
        this.localMedia = localMedia;
        this.remoteMedia = remoteMedia;
        this.captionPostingId = captionPostingId;
        this.caption = caption;
    }

    // for compatibility with MediaAttachment interface
    get media(): PrivateMediaFileInfo | undefined {
        return this.localMedia;
    }

    get mediaId(): string | undefined {
        return this.localMedia?.id ?? this.remoteMedia?.mediaId ?? undefined;
    }

    get hash(): string | undefined {
        return this.localMedia?.hash ?? this.remoteMedia?.hash ?? undefined;
    }

    get path(): string | undefined {
        return this.localMedia?.path ??
            (this.remoteMedia != null
                ? `private/${this.remoteMedia.mediaId}.${extension(this.remoteMedia.mimeType)}`
                : undefined
            );
    }

    get mimeType(): string | undefined {
        return this.localMedia?.mimeType ?? this.remoteMedia?.mimeType ?? undefined;
    }

    get size(): number | undefined {
        return this.localMedia?.size ?? this.remoteMedia?.size ?? undefined;
    }

    get title(): string | undefined {
        return this.localMedia?.title ?? this.remoteMedia?.title ?? undefined;
    }

    set title(title: string | null | undefined) {
        if (this.localMedia != null) {
            this.localMedia.title = title;
        }
        if (this.remoteMedia != null) {
            this.remoteMedia.title = title;
        }
    }

    get attachment(): boolean {
        return this.localMedia?.attachment ?? this.remoteMedia?.attachment ?? false;
    }

    get grant(): string | undefined {
        return this.localMedia?.grant ?? this.remoteMedia?.grant ?? undefined;
    }

    clone(): MediaWithCaption {
        return new MediaWithCaption(
            cloneDeep(this.localMedia),
            cloneDeep(this.remoteMedia),
            this.captionPostingId,
            cloneDeep(this.caption)
        );
    }

    withTitle(title: string | null | undefined): MediaWithCaption {
        const copy = this.clone();
        copy.title = title;
        return copy;
    }

    withCaption(caption: MediaCaption): MediaWithCaption {
        const copy = this.clone();
        copy.caption = caption;
        return copy;
    }

}
