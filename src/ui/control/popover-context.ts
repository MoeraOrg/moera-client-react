import { createContext, useContext } from 'react';

export interface PopoverInterface {
    update: () => void;
}

export const PopoverContext = createContext<PopoverInterface>({
    update: () => {},
});

export const usePopover = (): PopoverInterface => useContext(PopoverContext);
