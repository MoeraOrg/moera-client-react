import { createContext, useContext } from "react";

export interface ModalDialogInterface {
    overlayId: string | undefined;
}

export const ModalDialogContext = createContext<ModalDialogInterface>({
    overlayId: undefined
});

export const useModalDialog = (): ModalDialogInterface => useContext(ModalDialogContext);
