import { createContext, useContext } from 'react';

export interface LightboxWindowInterface {
    resetWheelScroll(): void;
}

export const LightboxWindowContext = createContext<LightboxWindowInterface>({
    resetWheelScroll: () => {},
});

export const useLightboxWindow = (): LightboxWindowInterface => useContext(LightboxWindowContext);
