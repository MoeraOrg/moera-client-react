import { useCallback, useEffect, useMemo, useRef } from 'react';

type TimeoutId = number;

export interface ManagedTimeout {
    clear: () => void;
    isActive: () => boolean;
    set: (handler: () => void, delay: number) => void;
}

export function useManagedTimeout(): ManagedTimeout {
    const timeoutRef = useRef<TimeoutId | null>(null);

    const clear = useCallback(() => {
        if (timeoutRef.current === null) {
            return;
        }

        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
    }, []);

    const set = useCallback((handler: () => void, delay: number): void => {
        clear();

        timeoutRef.current = window.setTimeout(() => {
            timeoutRef.current = null;
            handler();
        }, delay);
    }, [clear]);

    const isActive = useCallback(() => timeoutRef.current !== null, []);

    useEffect(() => clear, [clear]);

    return useMemo(() => ({clear, isActive, set}), [clear, isActive, set]);
}
