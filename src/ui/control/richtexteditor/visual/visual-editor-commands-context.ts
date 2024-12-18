import { createContext, useContext } from 'react';

export interface VisualEditorCommandsInterface {
    enableHeading: boolean;

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
}

export const VisualEditorCommandsContext = createContext<VisualEditorCommandsInterface>({
    enableHeading: true,

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
});

export const useVisualEditorCommands = (): VisualEditorCommandsInterface => useContext(VisualEditorCommandsContext);
