import { createContext, useContext } from 'react';

export interface LightboxInterface {
    animating: boolean;
    zoomLevel: number;
    changeZoom(nextLevel: number, clientX?: number, clientY?: number): void;
    resetWheelScroll(): void;
}

export const LightboxContext = createContext<LightboxInterface>({
    animating: false,
    zoomLevel: 0,
    changeZoom: () => {},
    resetWheelScroll: () => {},
});

export const useLightbox = (): LightboxInterface => useContext(LightboxContext);
