import { createContext, useContext } from "react";

export interface VisualEditorCommandsInterface {
    inBold: boolean;
    inItalic: boolean;
    inStrikeout: boolean;
    inLink: boolean;
    inSpoiler: boolean;
    inMention: boolean;
    inBlockquote: boolean;

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
}

export const VisualEditorCommandsContext = createContext<VisualEditorCommandsInterface>({
    inBold: false,
    inItalic: false,
    inStrikeout: false,
    inLink: false,
    inSpoiler: false,
    inMention: false,
    inBlockquote: false,

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
});

export const useVisualEditorCommands = (): VisualEditorCommandsInterface => useContext(VisualEditorCommandsContext);
