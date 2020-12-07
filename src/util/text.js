import { SMILEY_LIKE, SMILEYS } from "smileys";

export function replaceSmileys(text) {
    if (text == null) {
        return text;
    }
    return text.replace(SMILEY_LIKE, (match, p1, p2) => {
        if (p2.startsWith("\\")) {
            return p1 + p2.substring(1);
        }
        for (const smiley of SMILEYS) {
            if (smiley.regex.test(p2)) {
                return p1 + String.fromCodePoint(smiley.emoji);
            }
        }
        return match;
    })
}
