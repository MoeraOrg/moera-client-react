import { createContext, useContext } from "react";

export interface VisualEditorCommandsInterface {
    enableBlockquote: boolean;

    inBold: boolean;
    inItalic: boolean;
    inStrikeout: boolean;
    inLink: boolean;
    inSpoiler: boolean;
    inMention: boolean;
    inBlockquote: boolean;
    inList: boolean;
    inUnorderedList: boolean;
    inOrderedList: boolean;

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
}

export const VisualEditorCommandsContext = createContext<VisualEditorCommandsInterface>({
    enableBlockquote: true,

    inBold: false,
    inItalic: false,
    inStrikeout: false,
    inLink: false,
    inSpoiler: false,
    inMention: false,
    inBlockquote: false,
    inList: false,
    inUnorderedList: false,
    inOrderedList: false,

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
});

export const useVisualEditorCommands = (): VisualEditorCommandsInterface => useContext(VisualEditorCommandsContext);
