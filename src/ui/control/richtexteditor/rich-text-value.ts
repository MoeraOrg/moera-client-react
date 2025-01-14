import { MediaWithDigest, SourceFormat, VerifiedMediaFile } from "api";
import { mediaHashesExtract } from "util/media-images";
import { replaceSmileys } from "util/text";
import { Scripture } from "ui/control/richtexteditor/visual/scripture";
import { scriptureToHtml, htmlToScripture } from "ui/control/richtexteditor/visual/scripture-html";
import { notNull } from "util/misc";

export class RichTextValue {

    readonly value: string | Scripture;
    readonly media?: (VerifiedMediaFile | null)[] | null;

    constructor(value: string | Scripture, format: SourceFormat, media?: (VerifiedMediaFile | null)[] | null) {
        if (format === "html/visual") {
            value = htmlToScripture(value, false, media?.filter(notNull));
        }
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
