import { createContext, useContext } from "react";

export interface VisualEditorCommandsInterface {
    formatBold: () => void;
    formatItalic: () => void;
    formatStrikeout: () => void;
}

export const VisualEditorCommandsContext = createContext<VisualEditorCommandsInterface>({
    formatBold: () => {},
    formatItalic: () => {},
    formatStrikeout: () => {}
});

export const useVisualEditorCommands = (): VisualEditorCommandsInterface => useContext(VisualEditorCommandsContext);
