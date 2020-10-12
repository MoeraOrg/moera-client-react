import sanitizeHtml from 'sanitize-html';
import { parse as parseEmojis } from 'twemoji-parser';

function createEmojiElement(entity) {
    return `<img src="${entity.url}" alt="${entity.text}" class="emoji">`;
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
    return sanitizeHtml(replaceEmojis(html), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
            "img", "del", "ins", "sub", "details", "summary", "mr-spoiler"
        ]),
        allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            "*": ["dir"],
            img: ["src", "srcset", "width", "height", "alt"],
            a: ["href", "data-nodename"],
            p: ["style"],
            "mr-spoiler": ["title"]
        },
        allowedClasses: {
            img: "emoji"
        },
        allowedStyles: {
            "*": {
                "text-align": [/^left$/, /^right$/, /^center$/],
            }
        },
        transformTags: {
            "h1": "b",
            "h2": "b",
            "h3": "b",
            "h4": "b",
            "h5": "b",
            "h6": "b"
        }
    });
}

export function safeHtml(html) {
    if (!html) {
        return "";
    }
    return sanitizeHtml(replaceEmojis(html), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
            "h1", "h2", "img", "del", "ins", "sub", "details", "summary", "mr-spoiler"
        ]),
        allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            "*": ["dir"],
            img: ["src", "srcset", "width", "height", "alt"],
            a: ["href", "data-nodename"],
            p: ["style"],
            "mr-spoiler": ["title"]
        },
        allowedClasses: {
            img: "emoji"
        },
        allowedStyles: {
            "*": {
                "text-align": [/^left$/, /^right$/, /^center$/],
            }
        }
    });
}

export function quoteHtml(html) {
    if (html == null) {
        return null;
    }
    return html
        .replace(/\n*<p>\n*/gi, "\n\n")
        .replace(/<blockquote>\n+/gi, "<blockquote>\n")
        .replace(/<\/p>/gi, "")
        .replace(/\n*<br\s*\/?>\n*/gi, "\n")
        .replace(/<a[^>]*data-nodename[^>]*>(@[^<]+)<\/a>/gi, "$1")
        .replace(/<img\s+src="https:\/\/twemoji\.[^"]*\/([0-9a-f]+).svg"[^>]*>/gi,
            (g0, g1) => String.fromCodePoint(parseInt(g1, 16)))
        .trim()
}
