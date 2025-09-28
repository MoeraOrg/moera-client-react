import { createContext, useContext } from 'react';

export interface SandwichInterface {
    hide: () => void;
}

export const SandwichContext = createContext<SandwichInterface>({
    hide: () => {}
});

export const useSandwich = (): SandwichInterface => useContext(SandwichContext);
