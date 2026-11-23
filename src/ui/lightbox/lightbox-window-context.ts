import { createContext, useContext } from 'react';

export interface LightboxWindowInterface {
    swipeOffsetX: number;
    resetWheelScroll(): void;
}

export const LightboxWindowContext = createContext<LightboxWindowInterface>({
    swipeOffsetX: 0,
    resetWheelScroll: () => {},
});

export const useLightboxWindow = (): LightboxWindowInterface => useContext(LightboxWindowContext);
