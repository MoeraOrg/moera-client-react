import { createContext, useContext } from 'react';

interface LightBoxInterface {
    overlayId: string | undefined;
}

export const LightBoxContext = createContext<LightBoxInterface>({
    overlayId: undefined
});

export const useLightBox = (): LightBoxInterface => useContext(LightBoxContext);
