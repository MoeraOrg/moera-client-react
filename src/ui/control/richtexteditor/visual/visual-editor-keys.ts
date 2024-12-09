export const VISUAL_EDITOR_KEYS = {
    BOLD: "B",
    ITALIC: "I",
    STRIKEOUT: "R",
    LINK: "K",
    BLOCKQUOTE: "'",
    HORIZONTAL_RULE: "H",
    CODE: "Shift-C",
};

export function checkKeyCode(letter: string, code: string, shiftKey: boolean): boolean {
    if (letter.startsWith("Shift-") !== shiftKey) {
        return false;
    }
    if (letter.startsWith("Shift-")) {
        letter = letter.substring(6);
    }
    if (letter === "'") {
        return code === "Quote";
    }
    return code === "Key" + letter;
}
