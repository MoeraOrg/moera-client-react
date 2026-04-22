import { createContext, useContext } from 'react';

import { ElementSize } from "ui/hook";

export interface LightboxInterface {
    animating: boolean;
    boxSize: ElementSize;
    dyed: boolean;
    zoomLevel: number;
    changeZoom(nextLevel: number, clientX?: number, clientY?: number, options?: LightboxChangeZoomOptions): void;
    toggleDyed(): void;
}

export interface LightboxChangeZoomOptions {
    constrainOffsets?: boolean;
}

export const LightboxContext = createContext<LightboxInterface>({
    animating: false,
    boxSize: {
        width: 0,
        height: 0
    },
    dyed: false,
    zoomLevel: 0,
    changeZoom: () => {},
    toggleDyed: () => {},
});

export const useLightbox = (): LightboxInterface => useContext(LightboxContext);
