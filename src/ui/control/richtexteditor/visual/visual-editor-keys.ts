import isHotkey, { KeyboardEventLike } from 'is-hotkey';

import * as Browser from "ui/browser";

class VisualEditorKey {

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

export const VISUAL_EDITOR_KEYS = {
    BOLD:               new VisualEditorKey("Mod-B"),
    ITALIC:             new VisualEditorKey("Mod-I"),
    STRIKEOUT:          new VisualEditorKey("Mod-Shift-S"),
    LINK:               new VisualEditorKey("Mod-K"),
    BLOCKQUOTE:         new VisualEditorKey("Mod-'"),
    BLOCKUNQUOTE:       new VisualEditorKey("Mod-Shift-'"),
    HORIZONTAL_RULE:    new VisualEditorKey("Mod-H"),
    CODE:               new VisualEditorKey("Mod-Shift-C"),
    MARK:               new VisualEditorKey("Mod-M"),
    CLEAR:              new VisualEditorKey("Mod-\\"),
};
