import sanitizeHtml, { Attributes, IOptions, Tag, Transformer } from 'sanitize-html';
import { EmojiEntity, parse as parseEmojis } from 'twemoji-parser';
import * as HtmlEntities from 'html-entities';

import { MediaAttachment, PrivateMediaFileInfo } from "api";
import { twemojiUrl } from "util/twemoji";
import { mediaImageSize } from "util/media-images";
import { isNumericString } from "util/misc";

let prefixIndex = 0;

function addDirAuto(tagName: string, attribs: Attributes): Tag {
    return attribs["dir"] ? {tagName, attribs} : {tagName, attribs: {...attribs, dir: "auto"}};
}

function createDimensionsTransformer(media: MediaAttachment[] | null | undefined): Transformer {
    const mediaMap: Map<string, PrivateMediaFileInfo> = new Map(
        (media ?? [])
            .map(ma => ma.media)
            .filter((mf): mf is PrivateMediaFileInfo => mf != null)
            .map(mf => [mf.hash, mf])
    );

    return (tagName: string, attribs: Attributes): Tag => {
        const src = attribs["src"];
        const mediaFile = src != null && src.startsWith("hash:") ? mediaMap.get(src.substring(5)) : null;
        if (mediaFile == null) {
            return {tagName, attribs};
        }

        const width = isNumericString(attribs["width"]) ? parseInt(attribs["width"]) : null;
        const height = isNumericString(attribs["height"]) ? parseInt(attribs["height"]) : null;
        const [imageWidth, imageHeight] = mediaImageSize(900, width, height, mediaFile, false);
        const style = `--width: ${imageWidth}px; --height: ${imageHeight}px; --aspect-ratio: ${imageWidth / imageHeight}`;

        return {tagName, attribs: {...attribs, style}};
    }
}

function createAnchorTransformers(): { [tagName: string]: string | Transformer } {
    const postPrefix = `${prefixIndex++}_`;
    return {
        'a': (tagName: string, attribs: Attributes) => {
            return !(attribs.href && attribs.href.startsWith('#')) ? { tagName, attribs } : {
                tagName,
                attribs: {...attribs, href: `#${postPrefix}${attribs.href.slice(1)}`}
            };
        },
        '*': (tagName: string, attribs: Attributes) => !attribs.id ? { tagName, attribs } : {
            tagName,
            attribs: {...attribs, id: postPrefix + attribs.id}
        }
    }
}

const BASE_SAFE_HTML_SETTINGS: IOptions = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        "img", "del", "ins", "sub", "strike", "details", "summary", "mr-spoiler", "iframe", "video", "audio"
    ]),
    allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        "*": ["dir", "id"],
        img: ["src", "srcset", "width", "height", "alt", "title", "style"],
        a: ["href", "title", "data-nodename", "data-href"],
        b: ["style"],
        p: ["style"],
        ol: ["start", "type"],
        iframe: [
            "src", "width", "height", "frameborder", "allow", "allowfullscreen", "sandbox", "scrolling",
            "allowtransparency", "style"
        ],
        "mr-spoiler": ["title"]
    },
    allowedSchemes: [...sanitizeHtml.defaults.allowedSchemes, "hash"],
    allowedClasses: {
        img: ["emoji"],
        b: ["emoji"],
        span: ["katex"],
        div: ["footnotes", "katex"]
    },
    allowedIframeHostnames: [
        "c.simmer.io",
        "codepen.io",
        "docs.google.com",
        "itch.io",
        "odysee.com",
        "open.spotify.com",
        "peer.tube",
        "player.vimeo.com",
        "rumble.com",
        "www.facebook.com",
        "www.youtube-nocookie.com",
        "www.youtube.com",
        "gifer.com",
        "giphy.com"
    ],
    allowedIframeDomains: ["livejournal.com"],
    allowedStyles: {
        "*": {
            "text-align": [/^left$/, /^right$/, /^center$/],
        },
        b: {
            "background-image": [/^url\('https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/twemoji\//]
        },
        iframe: {
            "width": [/^\d+px$/],
            "height": [/^\d+px$/]
        },
        img: {
            "--width": [/^\d+px$/],
            "--height": [/^\d+px$/],
            "--aspect-ratio": [/^[\d.]+$/]
        }
    },
    transformTags: {
        h1: addDirAuto,
        h2: addDirAuto,
        h3: addDirAuto,
        h4: addDirAuto,
        h5: addDirAuto,
        h6: addDirAuto,
        p: addDirAuto,
        ol: addDirAuto,
        ul: addDirAuto
    }
};

const SAFE_PREVIEW_HTML_SETTINGS: IOptions = {
    ...BASE_SAFE_HTML_SETTINGS,
    allowedClasses: {
        ...BASE_SAFE_HTML_SETTINGS.allowedClasses,
        table: ["table", "table-*"],
        th: ["table-*"],
        tr: ["table-*"],
        td: ["table-*"],
        "*": ["text-start", "text-end", "text-center", "float-*"]
    },
    transformTags: {
        ...BASE_SAFE_HTML_SETTINGS.transformTags,
        h1: "b",
        h2: "b",
        h3: "b",
        h4: "b",
        h5: "b",
        h6: "b"
    }
};

const SAFE_HTML_SETTINGS: IOptions = {
    ...BASE_SAFE_HTML_SETTINGS,
    allowedClasses: {
        ...BASE_SAFE_HTML_SETTINGS.allowedClasses,
        table: ["table", "table-*"],
        th: ["table-*"],
        tr: ["table-*"],
        td: ["table-*"],
        "*": ["bg-*", "border", "border-*", "text-*", "fs-*", "float-*"]
    }
};

const SAFE_IMPORT_HTML_SETTINGS: IOptions = {
    ...BASE_SAFE_HTML_SETTINGS,
    allowedTags: (BASE_SAFE_HTML_SETTINGS.allowedTags || [])
        .filter(tag => ![
            "span"
        ].includes(tag)),
    transformTags: {}
};

function createEmojiElement(entity: EmojiEntity): string {
    return `<b style="background-image: url('${entity.url}')" class="emoji">${entity.text}</b>`;
}

export function replaceEmojis(html: string | null | undefined): string {
    if (!html) {
        return "";
    }

    const entities = parseEmojis(html, {buildUrl: twemojiUrl});
    let shift = 0;
    let current = html;
    for (let entity of entities) {
        const img = createEmojiElement(entity);
        current = current.substring(0, entity.indices[0] + shift) + img + current.substring(entity.indices[1] + shift);
        shift += img.length - (entity.indices[1] - entity.indices[0]);
    }

    return current;
}

export function safePreviewHtml(html: string | null | undefined, media: MediaAttachment[] | null | undefined): string {
    if (!html) {
        return "";
    }
    return sanitizeHtml(replaceEmojis(html), {
        ...SAFE_PREVIEW_HTML_SETTINGS,
        transformTags: {
            ...SAFE_PREVIEW_HTML_SETTINGS.transformTags,
            ...createAnchorTransformers(),
            img: createDimensionsTransformer(media)
        }
    });
}

export function safeHtml(html: string | null | undefined, media: MediaAttachment[] | null | undefined): string {
    if (!html) {
        return "";
    }
    return sanitizeHtml(replaceEmojis(html), {
        ...SAFE_HTML_SETTINGS,
        transformTags: {
            ...SAFE_HTML_SETTINGS.transformTags,
            ...createAnchorTransformers(),
            img: createDimensionsTransformer(media)
        }
    });
}

export function safeImportHtml(html: string | null | undefined): string {
    if (!html) {
        return "";
    }
    return sanitizeHtml(html, SAFE_IMPORT_HTML_SETTINGS)
        .replace(/([^>\s])\s*\n\s*([^<\s])/g, "$1 $2")
        .replace(/<div(\s[^>]*)?>/gi, "\n")
        .replace(/<\/div>/gi, "")
        .replace(/\n\s*\n/g, "\n\n")
        .replace(/<a[^>]*>(#\S+)<\/a>/g, "$1") // Facebook tag
        .replace("<a></a>", "") // Facebook post cutting mark
        .trim();
}

export function quoteHtml(html: string): string;
export function quoteHtml(html?: null): null;
export function quoteHtml(html?: string | null): string | null;
export function quoteHtml(html?: string | null): string | null {
    if (html == null) {
        return null;
    }
    return htmlToEmoji(html)
        .replace(/\n*<p(\s[^>]*)?>\n*/gi, "\n\n")
        .replace(/<blockquote>\n+/gi, "<blockquote>\n")
        .replace(/<\/p>/gi, "")
        .replace(/\n*<br\s*\/?>\n*/gi, "\n")
        .replace(/(?:<span>)?<a[^>]*data-nodename[^>]*>(@[^<]+)<\/a>(?:<\/span>)?/gi, "$1")
        .replace(/(?:<span>)?<a[^>]*data-nodename="([^"]*)"[^>]*>([^<]+)<\/a>(?:<\/span>)?/gi, "@$1[$2]")
        .replace(/<a[^>]*href=(['"])([^'"]+)\1[^>]*>\2<\/a>/gi, "$2")
        .replace(/\n\s*\n/g, "\n\n")
        .trim()
}

export function htmlToEmoji(html: string): string {
    return html
        .replace(/<b\s[^>]*class="emoji"[^>]*>(..?)<\/b>/gi, "$1")
        .replace(/<img\s+src="https:\/\/twemoji\.[^"]*\/([0-9a-f]+).svg"[^>]*>/gi,
            (g0, g1) => String.fromCodePoint(parseInt(g1, 16)))
        .replace(/<img\s[^>]*src="https:\/\/static.[a-z]+.fbcdn.net\/images\/emoji.php\/[^"]*\/([0-9a-f_]+).png"[^>]*>/gi,
            (g0, g1) => String.fromCodePoint(...(g1.split("_").map((v: string) => parseInt(v, 16)))));
}

type ReplacementLevel = "none" | "basic" | "all";

export function containsTags(html: string, replacementLevel: ReplacementLevel): boolean {
    if (replacementLevel !== "none") {
        if (replacementLevel === "all") {
            html = html.replace(/<\/?(p|div|span|br)(\s[^>]*)?>/gi, "");
        } else {
            html = html.replace(/<\/?(p|br)(\s[^>]*)?>/gi, "");
        }
        html = html
            .replace(/<a[^>]*data-nodename[^>]*>(@[^<]+)<\/a>/gi, "$1")
            .replace(/<a[^>]*href=(['"])([^'"]+)\1[^>]*>\2<\/a>/gi, "$2");
        html = htmlToEmoji(html);
    }
    return html.search(/<[a-zA-z][^\n]*>/) >= 0;
}

export function clearHtml(html: string | null | undefined): string {
    return unhtmlEntities(html).replace(/<\/?[a-z][^>]*>/gi, "").trim();
}

export function htmlEntities(s: string | null | undefined): string {
    return HtmlEntities.encode(s);
}

export function unhtmlEntities(s: string | null | undefined): string {
    return HtmlEntities.decode(s);
}

export function unhtmlEntitiesMinimal(s: string | null | undefined): string {
    return (s ?? "").replaceAll("&amp;", "&").replaceAll("&lt;", "<");
}
