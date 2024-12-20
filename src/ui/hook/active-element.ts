import { useCallback, useEffect, useState } from 'react';

export function useActiveElement(): Element | null {
    const [activeElement, setActiveElement] = useState(() => document.activeElement);

    const updateActiveElement = useCallback(() => setActiveElement(document.activeElement), []);

    useEffect(() => {
        document.addEventListener("focus", updateActiveElement, true);
        return () => document.removeEventListener("focus", updateActiveElement, true);
    }, [updateActiveElement]);

    const unsetActiveElement = useCallback(() => setActiveElement(null), []);

    useEffect(() => {
        document.addEventListener("blur", unsetActiveElement, true);
        return () => document.removeEventListener("blur", unsetActiveElement, true);
    }, [unsetActiveElement]);

    return activeElement;
}
