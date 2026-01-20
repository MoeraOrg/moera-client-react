import React, { createContext, useContext } from 'react';

import { VerifiedMediaFile } from "api";
import { RICH_TEXT_EDITOR_KEYS } from "ui/control/richtexteditor/rich-text-editor-keys";

export interface RichTextEditorCommandsInterface {
    enableHeading: boolean;
    enableUndo: boolean;
    enableRedo: boolean;
    supportsComplexBlocks: boolean;
    supportsEmbeddedMedia: boolean;
    supportsMedia: boolean;
    supportsVideo: boolean;
    supportsClear: boolean;
    supportsUndoRedo: boolean;

    inBold: boolean;
    inItalic: boolean;
    inStrikeout: boolean;
    inLink: boolean;
    inSpoilerInline: boolean;
    inSpoilerBlock: boolean;
    inSpoiler: boolean;
    inMention: boolean;
    inBlockquote: boolean;
    inList: boolean;
    inUnorderedList: boolean;
    inOrderedList: boolean;
    headingLevel: number;
    inVoid: boolean;
    inFold: boolean;
    inCode: boolean;
    inCodeBlock: boolean;
    inSubscript: boolean;
    inSuperscript: boolean;
    inFormula: boolean;
    inMark: boolean;
    inImageEmbedded: boolean;
    inImageAttached: boolean;

    focus: () => void;
    resetSelection: () => void;
    formatBold: () => void;
    formatItalic: () => void;
    formatStrikeout: () => void;
    formatLink: () => void;
    formatSpoiler: () => void;
    formatMention: (typeOnCancel: boolean) => void;
    formatHorizontalRule: () => void;
    formatEmoji: (emoji: string) => void;
    formatBlockquote: () => void;
    formatBlockunquote: () => void;
    formatList: (ordered: boolean) => void;
    formatIndent: (delta: number) => void;
    formatHeading: (level: number) => void;
    formatVideo: () => void;
    formatFold: () => void;
    formatCode: () => void;
    formatCodeBlock: () => void;
    formatSubscript: () => void;
    formatSuperscript: () => void;
    formatFormula: () => void;
    formatMark: () => void;
    formatClear: () => void;
    formatImage: (embedded?: boolean) => void;
    embedImage: (mediaFile: VerifiedMediaFile) => void;
    undo: () => void;
    redo: () => void;
    enterText: (text: string) => void;
}

export const RichTextEditorCommandsContext = createContext<RichTextEditorCommandsInterface>({
    enableHeading: true,
    enableUndo: true,
    enableRedo: true,
    supportsComplexBlocks: true,
    supportsEmbeddedMedia: true,
    supportsMedia: true,
    supportsVideo: true,
    supportsClear: true,
    supportsUndoRedo: true,

    inBold: false,
    inItalic: false,
    inStrikeout: false,
    inLink: false,
    inSpoilerInline: false,
    inSpoilerBlock: false,
    inSpoiler: false,
    inMention: false,
    inBlockquote: false,
    inList: false,
    inUnorderedList: false,
    inOrderedList: false,
    headingLevel: 0,
    inVoid: false,
    inFold: false,
    inCode: false,
    inCodeBlock: false,
    inSubscript: false,
    inSuperscript: false,
    inFormula: false,
    inMark: false,
    inImageEmbedded: false,
    inImageAttached: false,

    focus: () => {},
    resetSelection: () => {},
    formatBold: () => {},
    formatItalic: () => {},
    formatStrikeout: () => {},
    formatLink: () => {},
    formatSpoiler: () => {},
    formatMention: () => {},
    formatHorizontalRule: () => {},
    formatEmoji: () => {},
    formatBlockquote: () => {},
    formatBlockunquote: () => {},
    formatList: () => {},
    formatIndent: () => {},
    formatHeading: () => {},
    formatVideo: () => {},
    formatFold: () => {},
    formatCode: () => {},
    formatCodeBlock: () => {},
    formatSubscript: () => {},
    formatSuperscript: () => {},
    formatFormula: () => {},
    formatMark: () => {},
    formatClear: () => {},
    formatImage: () => {},
    embedImage: () => {},
    undo: () => {},
    redo: () => {},
    enterText: () => {}
});

type RichTextEditorCommands = RichTextEditorCommandsInterface & {
    handleHotKeys: (event: React.KeyboardEvent) => boolean;
}

export function useRichTextEditorCommands(): RichTextEditorCommands {
    const context = useContext(RichTextEditorCommandsContext);
    
    const handleHotKeys = (event: React.KeyboardEvent) => {
        if (event.ctrlKey && !event.altKey && !event.metaKey) {
            if (RICH_TEXT_EDITOR_KEYS.BOLD.check(event)) {
                context.formatBold();
                return true;
            } else if (RICH_TEXT_EDITOR_KEYS.ITALIC.check(event)) {
                context.formatItalic();
                return true;
            } else if (RICH_TEXT_EDITOR_KEYS.STRIKEOUT.check(event)) {
                context.formatStrikeout();
                return true;
            } else if (RICH_TEXT_EDITOR_KEYS.LINK.check(event)) {
                context.formatLink();
                return true;
            } else if (context.supportsComplexBlocks && RICH_TEXT_EDITOR_KEYS.BLOCKQUOTE.check(event)) {
                context.formatBlockquote();
                return true;
            } else if (context.supportsComplexBlocks && RICH_TEXT_EDITOR_KEYS.BLOCKUNQUOTE.check(event)) {
                context.formatBlockunquote();
                return true;
            } else if (context.supportsComplexBlocks && RICH_TEXT_EDITOR_KEYS.HORIZONTAL_RULE.check(event)) {
                context.formatHorizontalRule();
                return true;
            } else if (RICH_TEXT_EDITOR_KEYS.CODE.check(event)) {
                context.formatCode();
                return true;
            } else if (RICH_TEXT_EDITOR_KEYS.MARK.check(event)) {
                context.formatMark();
                return true;
            } else if (context.supportsClear && RICH_TEXT_EDITOR_KEYS.CLEAR.check(event)) {
                context.formatClear();
                return true;
            } else if (RICH_TEXT_EDITOR_KEYS.EN_DASH.check(event)) {
                context.enterText("\u2013");
                return true;
            } else if (RICH_TEXT_EDITOR_KEYS.EM_DASH.check(event)) {
                context.enterText("\u2014");
                return true;
            } else if (RICH_TEXT_EDITOR_KEYS.ANGLE_QUOTE_LEFT.check(event)) {
                context.enterText("\u00AB");
                return true;
            } else if (RICH_TEXT_EDITOR_KEYS.ANGLE_QUOTE_RIGHT.check(event)) {
                context.enterText("\u00BB");
                return true;
            } else if (RICH_TEXT_EDITOR_KEYS.DOUBLE_QUOTE_LEFT.check(event)) {
                context.enterText("\u201C");
                return true;
            } else if (RICH_TEXT_EDITOR_KEYS.DOUBLE_QUOTE_RIGHT.check(event)) {
                context.enterText("\u201D");
                return true;
            }
        }
        return false;
    };

    return {
        ...context,
        handleHotKeys
    };
}
