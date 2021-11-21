import { PrivateMediaFileInfo } from "api/node/api-types";
import { mediaHashesExtract } from "util/media-images";

export class RichTextValue {

    text: string;
    media?: (PrivateMediaFileInfo | null)[] | null;

    constructor(text: string, media?: (PrivateMediaFileInfo | null)[] | null) {
        this.text = text;
        this.media = media;
    }

    orderedMediaList(): string[] | null {
        if (this.media == null) {
            return null;
        }

        const bodyMedia = this.media.filter((mf): mf is PrivateMediaFileInfo => mf != null);
        const mediaMap = new Map(bodyMedia.map(mf => [mf.hash, mf.id]));
        const embeddedHashes = mediaHashesExtract(this.text);

        return [...embeddedHashes].map(hash => mediaMap.get(hash)).filter((id): id is string => id != null)
            .concat(bodyMedia.filter(mf => !embeddedHashes.has(mf.hash)).map(mf => mf.id));
    }

}
