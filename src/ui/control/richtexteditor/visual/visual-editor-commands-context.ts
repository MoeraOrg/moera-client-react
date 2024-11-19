import { createContext, useContext } from "react";

export interface VisualEditorCommandsInterface {
    formatBold: () => void;
    formatItalic: () => void;
    formatStrikeout: () => void;
    formatLink: () => void;
}

export const VisualEditorCommandsContext = createContext<VisualEditorCommandsInterface>({
    formatBold: () => {},
    formatItalic: () => {},
    formatStrikeout: () => {},
    formatLink: () => {},
});

export const useVisualEditorCommands = (): VisualEditorCommandsInterface => useContext(VisualEditorCommandsContext);
