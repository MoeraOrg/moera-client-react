import Delta from 'quill-delta';

import { MediaWithDigest, SourceFormat, VerifiedMediaFile } from "api";
import { mediaHashesExtract } from "util/media-images";
import { deltaReplaceSmileys, replaceSmileys } from "util/text";
import { deltaEmpty, toDelta } from "util/delta";

export class RichTextValue {

    readonly value: string | Delta;
    readonly media?: (VerifiedMediaFile | null)[] | null;

    constructor(value: string | Delta, format: SourceFormat, media?: (VerifiedMediaFile | null)[] | null) {
        if (format === "delta") {
            value = toDelta(value);
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

    toString(smileysEnabled: boolean = false): string {
        if (typeof this.value !== "string") {
            if (!smileysEnabled) {
                return JSON.stringify(this.value);
            }
            const delta = deltaReplaceSmileys(this.value);
            return JSON.stringify(!deltaEmpty(delta) ? this.value.compose(delta) : this.value);
        } else {
            return (smileysEnabled ? replaceSmileys(this.value) : this.value).trim();
        }
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
