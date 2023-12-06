import { createContext, useContext } from "react";

export interface PopoverInterface {
    hide: () => void;
    update: () => void;
}

export const PopoverContext = createContext<PopoverInterface>({
    hide: () => {},
    update: () => {}
});

export const usePopover = (): PopoverInterface => useContext(PopoverContext);
