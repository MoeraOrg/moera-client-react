import sanitizeHtml from 'sanitize-html';
import { parse as parseEmojis } from 'twemoji-parser';

function addDirAuto(tagName, attribs) {
    return attribs["dir"] ? {tagName, attribs} : {tagName, attribs: {...attribs, dir: "auto"}};
}

const BASE_SAFE_HTML_SETTINGS = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        "img", "del", "ins", "sub", "details", "summary", "mr-spoiler", "iframe", "video", "audio"
    ]),
    allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        "*": ["dir"],
        img: ["src", "srcset", "width", "height", "alt", "title"],
        a: ["href", "title", "data-nodename", "data-href"],
        b: ["style"],
        p: ["style"],
        iframe: [
            "src", "width", "height", "frameborder", "allow", "allowfullscreen", "sandbox", "scrolling",
            "allowtransparency", "style"
        ],
        "mr-spoiler": ["title"]
    },
    allowedClasses: {
        img: "emoji",
        b: "emoji",
        span: "katex",
        div: "katex"
    },
    allowedIframeHostnames: [
        "www.youtube.com", "www.youtube-nocookie.com", "player.vimeo.com", "www.facebook.com", "peer.tube",
        "rumble.com", "open.spotify.com", "c.simmer.io" 
    ],
    allowedIframeDomains: ["livejournal.com"],
    allowedStyles: {
        "*": {
            "text-align": [/^left$/, /^right$/, /^center$/],
        },
        b: {
            "background-image": [/^url\('https:\/\/twemoji.maxcdn.com\//]
        },
        "iframe": {
            "width": [/^\d+px$/],
            "height": [/^\d+px$/]
        }
    },
    transformTags: {
        p: addDirAuto,
        ol: addDirAuto,
        ul: addDirAuto
    }
};

const SAFE_PREVIEW_HTML_SETTINGS = {
    ...BASE_SAFE_HTML_SETTINGS,
    transformTags: {
        ...BASE_SAFE_HTML_SETTINGS.transformTags,
        "h1": "b",
        "h2": "b",
        "h3": "b",
        "h4": "b",
        "h5": "b",
        "h6": "b"
    }
};

const SAFE_HTML_SETTINGS = {
    ...BASE_SAFE_HTML_SETTINGS
};

const SAFE_IMPORT_HTML_SETTINGS = {
    ...BASE_SAFE_HTML_SETTINGS,
    allowedTags: BASE_SAFE_HTML_SETTINGS.allowedTags
        .filter(tag => ![
            "div", "span"
        ].includes(tag)),
    transformTags: null
};

function createEmojiElement(entity) {
    return `<b style="background-image: url('${entity.url}')" class="emoji">${entity.text}</b>`;
}

export function replaceEmojis(html) {
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

export function safePreviewHtml(html) {
    if (!html) {
        return "";
    }
    return sanitizeHtml(replaceEmojis(html), SAFE_PREVIEW_HTML_SETTINGS);
}

export function safeHtml(html) {
    if (!html) {
        return "";
    }
    return sanitizeHtml(replaceEmojis(html), SAFE_HTML_SETTINGS);
}

export function safeImportHtml(html) {
    if (!html) {
        return "";
    }
    return sanitizeHtml(html.replace(/([^>\s])\s*\n\s*([^<\s])/g, "$1 $2"), SAFE_IMPORT_HTML_SETTINGS);
}

export function quoteHtml(html) {
    if (html == null) {
        return null;
    }
    return html
        .replace(/\n*<p(\s[^>]*)?>\n*/gi, "\n\n")
        .replace(/<blockquote>\n+/gi, "<blockquote>\n")
        .replace(/<\/p>/gi, "")
        .replace(/\n*<br\s*\/?>\n*/gi, "\n")
        .replace(/<a[^>]*data-nodename[^>]*>(@[^<]+)<\/a>/gi, "$1")
        .replace(/<img\s+src="https:\/\/twemoji\.[^"]*\/([0-9a-f]+).svg"[^>]*>/gi,
            (g0, g1) => String.fromCodePoint(parseInt(g1, 16)))
        .trim()
}

export function htmlToText(html) {
    if (html == null) {
        return null;
    }
    return sanitizeHtml(replaceEmojis(html), {
        allowedTags: [],
        allowedAttributes: {},
        transformTags: {
            "span": (tagName, attribs) => attribs["class"] === "generation" ? {text: ""} : {}
        }
    });
}

export function htmlEntities(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
