import { createContext, useContext } from "react";

export interface PopoverInterface {
    hide: () => void;
    update: () => void;
    overlayId: string | undefined;
}

export const PopoverContext = createContext<PopoverInterface>({
    hide: () => {},
    update: () => {},
    overlayId: undefined
});

export const usePopover = (): PopoverInterface => useContext(PopoverContext);
