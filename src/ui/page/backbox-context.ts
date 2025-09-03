import { createContext, useContext } from 'react';

interface BackBoxInterface {
    shadow: boolean;
}

export const BackBoxContext = createContext<BackBoxInterface>({
    shadow: false
});

export const useBackBox = (): BackBoxInterface => useContext(BackBoxContext);
