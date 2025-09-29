import { createContext, useContext } from 'react';

export interface ParentInterface {
    hide: () => void;
    overlayId: string | undefined;
}

export const ParentContext = createContext<ParentInterface>({
    hide: () => {},
    overlayId: undefined
});

export const useParent = (): ParentInterface => useContext(ParentContext);
