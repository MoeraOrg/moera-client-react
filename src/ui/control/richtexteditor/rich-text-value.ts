import { MediaWithDigest } from "api/node/api-types";
import { VerifiedMediaFile } from "api/node/images-upload";
import { mediaHashesExtract } from "util/media-images";

function toMediaWithDigest(media: VerifiedMediaFile): MediaWithDigest {
    return {
        id: media.id,
        digest: media.digest
    }
}

export class RichTextValue {

    text: string;
    media?: (VerifiedMediaFile | null)[] | null;

    constructor(text: string, media?: (VerifiedMediaFile | null)[] | null) {
        this.text = text;
        this.media = media;
    }

    orderedMediaListWithDigests(): MediaWithDigest[] | null {
        if (this.media == null) {
            return null;
        }

        const bodyMedia = this.media.filter((mf): mf is VerifiedMediaFile => mf != null);
        const mediaMap = new Map(bodyMedia.map(mf => [mf.hash, mf]));
        const embeddedHashes = mediaHashesExtract(this.text);

        return [...embeddedHashes].map(hash => mediaMap.get(hash)).filter((mf): mf is VerifiedMediaFile => mf != null)
            .concat(bodyMedia.filter(mf => !embeddedHashes.has(mf.hash))).map(toMediaWithDigest);
    }

    orderedMediaList(): string[] | null {
        const list = this.orderedMediaListWithDigests();
        return list != null ? list.map(md => md.id) : null;
    }

}
