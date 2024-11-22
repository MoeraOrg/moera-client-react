import { createContext, useContext } from "react";

export interface VisualEditorCommandsInterface {
    inBold: boolean;
    inItalic: boolean;
    inStrikeout: boolean;
    inLink: boolean;

    formatBold: () => void;
    formatItalic: () => void;
    formatStrikeout: () => void;
    formatLink: () => void;
}

export const VisualEditorCommandsContext = createContext<VisualEditorCommandsInterface>({
    inBold: false,
    inItalic: false,
    inStrikeout: false,
    inLink: false,

    formatBold: () => {},
    formatItalic: () => {},
    formatStrikeout: () => {},
    formatLink: () => {},
});

export const useVisualEditorCommands = (): VisualEditorCommandsInterface => useContext(VisualEditorCommandsContext);
