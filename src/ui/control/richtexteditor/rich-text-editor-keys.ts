import isHotkey, { KeyboardEventLike } from 'is-hotkey';

import * as Browser from "ui/browser";

class RichTextEditorKey {

    readonly title: string;
    private readonly checker: (event: KeyboardEventLike) => boolean;

    constructor(key: string | string[]) {
        const keys = Array.isArray(key) ? key : [key];
        this.title = keys.map(item =>
            Browser.isMac() ? item.replace("Mod", "Cmd") : item.replace("Mod", "Ctrl")
        ).join(" / ");
        this.checker = isHotkey(keys.map(item => item.replaceAll("-", "+").replaceAll("_", "-")));
    }

    check(event: KeyboardEventLike): boolean {
        return this.checker(event);
    }

}

export const RICH_TEXT_EDITOR_KEYS = {
    BOLD:               new RichTextEditorKey("Mod-B"),
    ITALIC:             new RichTextEditorKey("Mod-I"),
    STRIKEOUT:          new RichTextEditorKey("Mod-Shift-S"),
    LINK:               new RichTextEditorKey("Mod-K"),
    BLOCKQUOTE:         new RichTextEditorKey("Mod-'"),
    BLOCKUNQUOTE:       new RichTextEditorKey("Mod-Shift-'"),
    HORIZONTAL_RULE:    new RichTextEditorKey("Mod-H"),
    CODE:               new RichTextEditorKey("Mod-Shift-C"),
    MARK:               new RichTextEditorKey("Mod-M"),
    CLEAR:              new RichTextEditorKey("Mod-0"),
    EN_DASH:            new RichTextEditorKey(["Mod-1", "Mod-_"]),
    EM_DASH:            new RichTextEditorKey(["Mod-2", "Mod-Shift-_"]),
    ANGLE_QUOTE_LEFT:   new RichTextEditorKey("Mod-,"),
    ANGLE_QUOTE_RIGHT:  new RichTextEditorKey("Mod-."),
    DOUBLE_QUOTE_LEFT:  new RichTextEditorKey("Mod-Shift-,"),
    DOUBLE_QUOTE_RIGHT: new RichTextEditorKey("Mod-Shift-."),
};
