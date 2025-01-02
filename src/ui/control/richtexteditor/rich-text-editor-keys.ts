import isHotkey, { KeyboardEventLike } from 'is-hotkey';

import * as Browser from "ui/browser";

class RichTextEditorKey {

    readonly title: string;
    private readonly checker: (event: KeyboardEventLike) => boolean;

    constructor(key: string) {
        this.title = Browser.isMac() ? key.replace("Mod", "Cmd") : key.replace("Mod", "Ctrl");
        this.checker = isHotkey(key.replaceAll("-", "+"));
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
    CLEAR:              new RichTextEditorKey("Mod-\\"),
};
