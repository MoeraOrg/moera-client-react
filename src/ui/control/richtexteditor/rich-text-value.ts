import { MediaWithDigest, VerifiedMediaFile } from "api";
import { mediaHashesExtract } from "util/media-images";
import { replaceSmileys } from "util/text";

export class RichTextValue {

    text: string;
    media?: (VerifiedMediaFile | null)[] | null;

    constructor(text: string, media?: (VerifiedMediaFile | null)[] | null) {
        this.text = text;
        this.media = media;
    }

    toString(smileysEnabled: boolean = false): string {
        return (smileysEnabled ? replaceSmileys(this.text) : this.text).trim();
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
