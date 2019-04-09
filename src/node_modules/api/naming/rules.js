import charCategory from 'general-category';

export const NAME_MAX_LENGTH = 127;
export const NAME_PUNCTUATION_ALLOWED ="!%&*-.?";

const LATIN_CHARS = /^[A-Za-z]+$/;

export function isNameValid(name) {
    if (!name) {
        return false;
    }
    if (name.length <= 3 && name.match(LATIN_CHARS)) {
        return false;
    }
    for (let i = 0; i < name.length; i++) {
        if (!isNameCharacterValid(name[i])) {
            return false;
        }
    }
    return true;
}

export function isNameCharacterValid(c) {
    switch (charCategory(c)) {
        case "Lu":
        case "Ll":
        case "Lt":
        case "Lo":
        case "Nd":
        case "Nl":
        case "No":
        case "Sc":
        case "So":
            return true;

        case "Sm":
            return c !== "~";

        case "Po":
        case "Pd":
            return NAME_PUNCTUATION_ALLOWED.indexOf(c) >= 0;

        default:
            return false;
    }
}
