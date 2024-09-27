import Delta from 'quill-delta/dist/Delta';

import { MediaWithDigest, SourceFormat, VerifiedMediaFile } from "api";
import { mediaHashesExtract } from "util/media-images";

export class RichTextValue {

    readonly value: string | Delta;
    readonly media?: (VerifiedMediaFile | null)[] | null;

    constructor(value: string | Delta, format: SourceFormat, media?: (VerifiedMediaFile | null)[] | null) {
        if (format === "delta" && typeof value === "string") {
            value = value ? JSON.parse(value) : new Delta();
        }

        this.value = value;
        this.media = media;
    }

    get text(): string {
        return typeof this.value !== "string" ? JSON.stringify(this.value) : this.value;
    }

    get delta(): Delta {
        return typeof this.value !== "string" ? this.value : new Delta().insert(this.value);
    }

    orderedMediaListWithDigests(): MediaWithDigest[] | null {
        if (this.media == null) {
            return null;
        }

        const bodyMedia = this.media.filter((mf): mf is VerifiedMediaFile => mf != null);
        const mediaMap = new Map(bodyMedia.map(mf => [mf.hash, mf]));
        const embeddedHashes = mediaHashesExtract(this.text);

        return [...embeddedHashes]
            .map(hash => mediaMap.get(hash))
            .filter((mf): mf is VerifiedMediaFile => mf != null)
            .concat(bodyMedia.filter(mf => !embeddedHashes.has(mf.hash)))
            .map(media => ({id: media.id, digest: media.digest}));
    }

    orderedMediaList(): string[] | null {
        const list = this.orderedMediaListWithDigests();
        return list != null ? list.map(md => md.id) : null;
    }

}
