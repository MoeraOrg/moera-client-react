import { createContext, useContext } from "react";

export interface VisualEditorCommandsInterface {
    inBold: boolean;
    inItalic: boolean;
    inStrikeout: boolean;
    inLink: boolean;
    inSpoiler: boolean;
    inMention: boolean;

    formatBold: () => void;
    formatItalic: () => void;
    formatStrikeout: () => void;
    formatLink: () => void;
    formatSpoiler: () => void;
    formatMention: () => void;
}

export const VisualEditorCommandsContext = createContext<VisualEditorCommandsInterface>({
    inBold: false,
    inItalic: false,
    inStrikeout: false,
    inLink: false,
    inSpoiler: false,
    inMention: false,

    formatBold: () => {},
    formatItalic: () => {},
    formatStrikeout: () => {},
    formatLink: () => {},
    formatSpoiler: () => {},
    formatMention: () => {},
});

export const useVisualEditorCommands = (): VisualEditorCommandsInterface => useContext(VisualEditorCommandsContext);
