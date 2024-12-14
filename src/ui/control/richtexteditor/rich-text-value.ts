import { MediaWithDigest, SourceFormat, VerifiedMediaFile } from "api";
import { mediaHashesExtract } from "util/media-images";
import { replaceSmileys } from "util/text";
import { Scripture } from "ui/control/richtexteditor/visual/scripture";
import { scriptureToHtml, toScripture } from "ui/control/richtexteditor/visual/scripture-util";

export class RichTextValue {

    readonly value: string | Scripture;
    readonly media?: (VerifiedMediaFile | null)[] | null;

    constructor(value: string | Scripture, format: SourceFormat, media?: (VerifiedMediaFile | null)[] | null) {
        if (format === "html/visual") {
            value = toScripture(value);
        }
        this.value = value;
        this.media = media;
    }

    get text(): string {
        return typeof this.value !== "string" ? scriptureToHtml(this.value) : this.value;
    }

    get scripture(): Scripture {
        return typeof this.value !== "string" ? this.value : toScripture(this.value);
    }

    toString(smileysEnabled: boolean = false): string {
        let text: string;
        if (typeof this.value !== "string") {
            text = scriptureToHtml(this.value);
        } else {
            text = this.value;
        }
        return (smileysEnabled ? replaceSmileys(text) : text).trim();
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
