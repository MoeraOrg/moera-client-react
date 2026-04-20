import { createContext, useContext } from 'react';

import { ElementSize } from "ui/hook";

export interface LightboxInterface {
    animating: boolean;
    boxSize: ElementSize;
    zoomLevel: number;
    changeZoom(nextLevel: number, clientX?: number, clientY?: number): void;
    resetWheelScroll(): void;
}

export const LightboxContext = createContext<LightboxInterface>({
    animating: false,
    boxSize: {
        width: 0,
        height: 0
    },
    zoomLevel: 0,
    changeZoom: () => {},
    resetWheelScroll: () => {},
});

export const useLightbox = (): LightboxInterface => useContext(LightboxContext);
