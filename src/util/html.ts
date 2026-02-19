import sanitizeHtml, { Attributes, IOptions, Tag, Transformer } from 'sanitize-html';
import { EmojiEntity, parse as parseEmojis } from 'twemoji-parser';
import * as HtmlEntities from 'html-entities';
import * as immutable from 'object-path-immutable';

import { MediaAttachment, PrivateMediaFileInfo } from "api";
import { twemojiUrl } from "util/twemoji";
import { mediaHashStrip, mediaImageSize } from "util/media-images";
import { isNumericString, notNull } from "util/misc";
import { URL_PATTERN } from "util/url";

let prefixIndex = 0;

function addDirAuto(tagName: string, attribs: Attributes): Tag {
    return attribs["dir"] ? {tagName, attribs} : {tagName, attribs: {...attribs, dir: "auto"}};
}

function createDimensionsTransformer(media: MediaAttachment[] | null | undefined): Transformer {
    const mediaMap: Map<string, PrivateMediaFileInfo> = new Map(
        (media ?? [])
            .map(ma => ma.media)
            .filter(notNull)
            .map(mf => [mediaHashStrip(mf.hash), mf])
    );

    return (tagName: string, attribs: Attributes): Tag => {
        const src = attribs["src"];
        const mediaFile = src != null && src.startsWith("hash:")
            ? mediaMap.get(mediaHashStrip(src.substring(5)))
            : null;
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

function createAnchorTransformers(noFollow: boolean): { [tagName: string]: string | Transformer } {
    const postPrefix = `${prefixIndex++}_`;
    return {
        "a": (tagName: string, attribs: Attributes) => {
            const iattribs = immutable.wrap(attribs);
            if (noFollow) {
                iattribs.set("rel", "nofollow");
            }
            if (attribs.href && attribs.href.startsWith('#')) {
                iattribs.set("href", `#${postPrefix}${attribs.href.slice(1)}`);
            }
            return { tagName, attribs: iattribs.value() };
        },
        "*": (tagName: string, attribs: Attributes) =>
            !attribs.id
                ? { tagName, attribs }
                : {
                    tagName,
                    attribs: {...attribs, id: postPrefix + attribs.id}
                }
    }
}

const BASE_SAFE_HTML_SETTINGS: IOptions = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        "img", "del", "ins", "strike", "details", "summary", "mr-spoiler", "mr-spoiler-block", "iframe", "video",
        "audio"
    ]),
    allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        "*": ["dir", "id", "data-*"],
        img: ["src", "srcset", "width", "height", "alt", "title", "style"],
        a: ["href", "title", "rel", "data-nodename", "data-href"],
        b: ["style"],
        p: ["style"],
        ol: ["start", "type"],
        iframe: [
            "src", "width", "height", "frameborder", "allow", "allowfullscreen", "sandbox", "scrolling",
            "allowtransparency", "style"
        ],
        "mr-spoiler": ["title"],
        "mr-spoiler-block": ["title"],
    },
    allowedSchemes: [...sanitizeHtml.defaults.allowedSchemes, "hash"],
    allowedClasses: {
        img: ["emoji"],
        b: ["emoji"],
        span: ["katex", "mr-spoiler"],
        div: ["footnotes", "katex", "mr-spoiler", "mr-video"],
        summary: ["fw-*", "fs-*"]
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
        "www.linkedin.com",
        "www.youtube-nocookie.com",
        "www.youtube.com",
        "gifer.com",
        "giphy.com",
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
        ul: addDirAuto,
        "mr-spoiler-block": (tagName: string, attribs: Attributes) => ({
            tagName: "div",
            attribs: {"class": "mr-spoiler", "data-title": attribs["title"]}
        }),
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
        "*": ["bg-*", "border", "border-*", "text-*", "fw-*", "fs-*", "float-*"]
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

export function safePreviewHtml(
    html: string | null | undefined,
    media: MediaAttachment[] | null | undefined,
    noFollowOnLinks: boolean
): string {
    if (!html) {
        return "";
    }
    return sanitizeHtml(replaceEmojis(html), {
        ...SAFE_PREVIEW_HTML_SETTINGS,
        transformTags: {
            ...SAFE_PREVIEW_HTML_SETTINGS.transformTags,
            ...createAnchorTransformers(noFollowOnLinks),
            img: createDimensionsTransformer(media)
        }
    });
}

export function safeHtml(
    html: string | null | undefined,
    media: MediaAttachment[] | null | undefined,
    noFollowOnLinks: boolean
): string {
    if (!html) {
        return "";
    }
    return sanitizeHtml(replaceEmojis(html), {
        ...SAFE_HTML_SETTINGS,
        transformTags: {
            ...SAFE_HTML_SETTINGS.transformTags,
            ...createAnchorTransformers(noFollowOnLinks),
            img: createDimensionsTransformer(media)
        }
    });
}

export function safeImportHtml(html: string | null | undefined): string {
    if (!html) {
        return "";
    }
    return sanitizeHtml(strikeoutToHtml(html), SAFE_IMPORT_HTML_SETTINGS)
        .replace(/([^>\s])\s*\n\s*([^<\s])/g, "$1 $2")
        .replace(/<div(\s[^>]*)?>/gi, "\n")
        .replace(/<\/div>/gi, "")
        .replace(/\n\s*\n/g, "\n\n")
        .replace(/<a[^>]*>(#\S+)<\/a>/g, "$1") // Facebook tag
        .replace("<a></a>", "") // Facebook post cutting mark
        .trim();
}

export function htmlToEmoji(html: string): string {
    return html
        .replace(/<b\s[^>]*class="emoji"[^>]*>(..?)<\/b>/gi, "$1")
        .replace(/<img\s+src="https:\/\/twemoji\.[^"]*\/([0-9a-f]+).svg"[^>]*>/gi,
            (g0, g1) => String.fromCodePoint(parseInt(g1, 16)))
        .replace(/<img\s[^>]*src="https:\/\/static.[a-z]+.fbcdn.net\/images\/emoji.php\/[^"]*\/([0-9a-f_]+).png"[^>]*>/gi,
            (g0, g1) => String.fromCodePoint(...(g1.split("_").map((v: string) => parseInt(v, 16)))));
}

export function linefeedsToHtml(text: string | null | undefined): string {
    if (!text) {
        return "";
    }
    return text
        .replace(/\s*\n\s*\n\s*/g, "<p>")
        .replace(/\s*\n\s*/g, "<br>");
}

export function htmlToLinefeeds(html: string | null | undefined): string {
    if (!html) {
        return "";
    }
    return html
        .replace(/\n*<p(\s[^>]*)?>\n*/gi, "\n\n")
        .replace(/<\/p>/gi, "")
        .replace(/\n*<br\s*\/?>\n*/gi, "\n");
}

export function prettyHtml(html: string): string {
    return html
        .replace(/<br\/?>(?!\n)/g, "<br/>\n")
        .replace(/<\/p>(?!\n)/g, "</p>\n");
}

const URLS = new RegExp("(?<!\\S)" + URL_PATTERN, "g");

function urlsToHtml(text: string | null | undefined): string {
    if (!text) {
        return "";
    }
    return text.replace(URLS, (url: string) => `<a href="${url}">${url}</a>`);
}

export function strikeoutToHtml(text: string | null | undefined): string {
    if (!text || !text.includes("\u0336")) {
        return text ?? "";
    }

    let output = "";
    let inStrikeout = false;
    let lastChar: string | null = null;
    for (let i = 0; i < text.length; i++) {
        if (text[i] === "\u0336") {
            if (!inStrikeout) {
                output += "<s>";
                inStrikeout = true;
            }
            if (lastChar != null) {
                output += lastChar;
            }
            lastChar = null;
        } else {
            if (inStrikeout && lastChar != null) {
                output += "</s>";
                inStrikeout = false;
            }
            if (lastChar != null) {
                output += lastChar;
            }
            lastChar = text[i];
        }
    }
    if (inStrikeout) {
        output += "</s>";
    }
    if (lastChar != null) {
        output += lastChar;
    }

    return output;
}

export function plainTextToHtml(text: string | null | undefined): string {
    if (!text) {
        return "";
    }
    return linefeedsToHtml(strikeoutToHtml(urlsToHtml(htmlEntities(text))));
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

export const clearHtml = (html: string | null | undefined): string =>
    unhtmlEntities(html?.replace(/<\/?[a-z][^>]*>/gi, "")).trim();

export const htmlEntities = (s: string | null | undefined): string =>
    HtmlEntities.encode(s);

export const unhtmlEntities = (s: string | null | undefined): string =>
    HtmlEntities.decode(s);

export const unhtmlEntitiesMinimal = (s: string | null | undefined): string =>
    (s ?? "").replaceAll("&amp;", "&").replaceAll("&lt;", "<");

export const isHtmlEmpty = (html: string | null | undefined): boolean =>
    !html || html.trim() === "" || html.trim() === "<p></p>";

export function ht(strings: TemplateStringsArray, ...args: any[]): string {
    const all = [];
    let i = 0;
    while (i < strings.length || i < args.length) {
        if (i < strings.length) {
            all.push(strings[i]);
        }
        if (i < args.length) {
            all.push(htmlEntities(args[i]));
        }
        i++;
    }
    return all.join("");
}
