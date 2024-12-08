export const VISUAL_EDITOR_KEYS = {
    BOLD: "B",
    ITALIC: "I",
    STRIKEOUT: "R",
    LINK: "K",
    BLOCKQUOTE: "'",
    HORIZONTAL_RULE: "H",
    CODE: "T",
};

export function letterToKeyCode(letter: string): string {
    if (letter === "'") {
        return "Quote";
    }
    return "Key" + letter;
}
