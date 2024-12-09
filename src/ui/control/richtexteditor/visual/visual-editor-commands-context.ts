import { createContext, useContext } from "react";

export interface VisualEditorCommandsInterface {
    enableBlockquote: boolean;
    enableHeading: boolean;

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
    headingLevel: number;
    inVoid: boolean;
    inFold: boolean;
    inCode: boolean;
    inSubscript: boolean;
    inSuperscript: boolean;

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
    formatSubscript: () => void;
    formatSuperscript: () => void;
}

export const VisualEditorCommandsContext = createContext<VisualEditorCommandsInterface>({
    enableBlockquote: true,
    enableHeading: true,

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
    headingLevel: 0,
    inVoid: false,
    inFold: false,
    inCode: false,
    inSubscript: false,
    inSuperscript: false,

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
    formatSubscript: () => {},
    formatSuperscript: () => {},
});

export const useVisualEditorCommands = (): VisualEditorCommandsInterface => useContext(VisualEditorCommandsContext);
