import sanitizeHtml, { Attributes, IOptions, Tag, Transformer } from 'sanitize-html';
import { EmojiEntity, parse as parseEmojis } from 'twemoji-parser';
import { nanoid } from 'nanoid/non-secure';
import * as HtmlEntities from 'html-entities';

function addDirAuto(tagName: string, attribs: Attributes): Tag {
    return attribs["dir"] ? {tagName, attribs} : {tagName, attribs: {...attribs, dir: "auto"}};
}

function createAnchorTransformers(): { [tagName: string]: string | Transformer } {
    const randomId = nanoid();
    return {
        'a': (tagName: string, attribs: Attributes) => {
            return !(attribs.href && attribs.href.startsWith('#')) ? { tagName, attribs } : {
                tagName,
                attribs: {...attribs, href: `#${randomId}${attribs.href.slice(1)}`}
            };
        },
        '*': (tagName: string, attribs: Attributes) => !attribs.id ? { tagName, attribs } : {
            tagName,
            attribs: {...attribs, id: randomId + attribs.id}
        }
    }
}

const BASE_SAFE_HTML_SETTINGS: IOptions = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        "img", "del", "ins", "sub", "details", "summary", "mr-spoiler", "iframe", "video", "audio"
    ]),
    allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        "*": ["dir", "id"],
        img: ["src", "srcset", "width", "height", "alt", "title"],
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
        div: ["katex"]
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
        "www.youtube.com"
    ],
    allowedIframeDomains: ["livejournal.com"],
    allowedStyles: {
        "*": {
            "text-align": [/^left$/, /^right$/, /^center$/],
        },
        b: {
            "background-image": [/^url\('https:\/\/twemoji.maxcdn.com\//]
        },
        iframe: {
            "width": [/^\d+px$/],
            "height": [/^\d+px$/]
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

    const entities = parseEmojis(html);
    let shift = 0;
    let current = html;
    for (let entity of entities) {
        const img = createEmojiElement(entity);
        current = current.substring(0, entity.indices[0] + shift) + img + current.substring(entity.indices[1] + shift);
        shift += img.length - (entity.indices[1] - entity.indices[0]);
    }

    return current;
}

export function safePreviewHtml(html: string | null | undefined): string {
    if (!html) {
        return "";
    }
    return sanitizeHtml(replaceEmojis(html), {
        ...SAFE_PREVIEW_HTML_SETTINGS,
        transformTags: {
            ...SAFE_PREVIEW_HTML_SETTINGS.transformTags,
            ...createAnchorTransformers()
        }
    });
}

export function safeHtml(html: string | null | undefined): string {
    if (!html) {
        return "";
    }
    return sanitizeHtml(replaceEmojis(html), {
        ...SAFE_HTML_SETTINGS,
        transformTags: {
            ...SAFE_HTML_SETTINGS.transformTags,
            ...createAnchorTransformers()
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
        .replace(/<a[^>]*data-nodename[^>]*>(@[^<]+)<\/a>/gi, "$1")
        .replace(/\n\s*\n/g, "\n\n")
        .trim()
}

export function htmlToEmoji(html: string): string {
    return html
        .replace(/<b\s[^>]*class="emoji"[^>]*>(..?)<\/b>/gi, "$1")
        .replace(/<img\s+src="https:\/\/twemoji\.[^"]*\/([0-9a-f]+).svg"[^>]*>/gi,
            (g0, g1) => String.fromCodePoint(parseInt(g1, 16)))
        .replace(/<img\s[^>]*src="https:\/\/static.[a-z]+.fbcdn.net\/images\/emoji.php\/[^"]*\/([0-9a-f]+).png"[^>]*>/gi,
            (g0, g1) => String.fromCodePoint(parseInt(g1, 16)));
}

export function containsTags(html: string): boolean {
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
