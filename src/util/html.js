import sanitizeHtml from 'sanitize-html';

export function safePreviewHtml(html) {
    if (!html) {
        return "";
    }
    return sanitizeHtml(html, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
        allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ["src", "srcset", "width", "height"]
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
    return sanitizeHtml(html, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["h1", "h2", "img"]),
        allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ["src", "srcset", "width", "height"]
        }
    });
}
