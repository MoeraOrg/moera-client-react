// @ts-ignore
import charCategory from 'general-category';

export const NAME_MAX_LENGTH = 127;
export const NAME_PUNCTUATION_ALLOWED ="!*-.";

const LATIN_CHARS = /^[A-Za-z]+$/;
const DIGITS = /^[0-9]+$/;

export function isRegisteredNameValid(qName: string | null | undefined): boolean {
    if (!qName) {
        return false;
    }
    const parts = qName.split("_");
    if (parts.length > 2) {
        return false;
    }
    return isNameValid(parts[0]) && (parts.length === 1 || isGenerationValid(parts[1]));
}

function isNameValid(name: string): boolean {
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

function isGenerationValid(generation: string): boolean {
    if (!generation.match(DIGITS)) {
        return false;
    }
    return parseInt(generation) < 2147483647;
}

function isNameCharacterValid(c: string): boolean {
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

        case "Po":
        case "Pd":
            return NAME_PUNCTUATION_ALLOWED.indexOf(c) >= 0;

        default:
            return false;
    }
}
