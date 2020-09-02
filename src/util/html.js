import sanitizeHtml from 'sanitize-html';
import { parse as parseEmojis } from 'twemoji-parser';

const MAX_LENGTH_TO_TRY_PARSE_AS_SINGLE_EMOJI = 50;
const HTML_WITH_ONLY_EMOJI_BEFORE_REGEX = /^(\s*<\s*(mr-spoiler(\s+title="[^"]*")?|p)\s*>\s*)*/;
const HTML_WITH_ONLY_EMOJI_AFTER_REGEX = /^(\s*<\/(mr-spoiler|p)>\s*)*$/;

function emojiToImgTag(emoji, size=1) {
    return `<img src="${emoji.url}" alt="${emoji.text}" style="width: ${size}em; height: ${size}em">`;
}

export function replaceEmojis(html) {
    if (!html) {
        return "";
    }

    const emojis = parseEmojis(html);
    let shift = 0;
    let current = html;
    if (emojis.length === 1 &&
        // Too long html-s are probably containing something besides one emoji,
        // so we're not bothering to parse it
        html.length <= MAX_LENGTH_TO_TRY_PARSE_AS_SINGLE_EMOJI) {
        const emoji = emojis[0];
        const beforeEmoji = html.substring(0, emoji.indices[0]);
        const afterEmoji = html.substring(emoji.indices[1]);
        if (HTML_WITH_ONLY_EMOJI_BEFORE_REGEX.test(beforeEmoji) &&
            HTML_WITH_ONLY_EMOJI_AFTER_REGEX.test(afterEmoji)) {
            return beforeEmoji + emojiToImgTag(emoji, 3) + afterEmoji;
        }
    }

    for (let emoji of emojis) {
        const img = emojiToImgTag(emoji);
        current = current.substring(0, emoji.indices[0] + shift) + img + current.substring(emoji.indices[1] + shift);
        shift += img.length - (emoji.indices[1] - emoji.indices[0]);
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
            img: ["src", "srcset", "width", "height", "style"],
            a: ["href", "data-nodename"],
            "mr-spoiler": ["title"]
        },
        allowedClasses: {
            "details": "spoiler"
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
            img: ["src", "srcset", "width", "height", "style"],
            a: ["href", "data-nodename"],
            "mr-spoiler": ["title"]
        },
        allowedClasses: {
            "details": "spoiler"
        }
    });
}
