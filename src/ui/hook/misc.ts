import React from 'react';

// Based on @uidotdev/usehooks package

export function useDebounce<T>(value: T, delay: number): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [debouncedValue, setDebouncedValue] = React.useState(value);

    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return [debouncedValue, setDebouncedValue];
}

export function useThrottle<T>(value: T, interval: number, timeout: number): T {
    const [throttledValue, setThrottledValue] = React.useState<T>(value);
    const lastUpdated = React.useRef<number | null>(null);

    React.useEffect(() => {
        const now = Date.now();

        if (lastUpdated.current && now >= lastUpdated.current + timeout) {
            lastUpdated.current = now;
            setThrottledValue(value);
        } else {
            const id = window.setTimeout(() => {
                lastUpdated.current = now;
                setThrottledValue(value);
            }, interval);

            return () => window.clearTimeout(id);
        }
    }, [value, interval, timeout]);

    return throttledValue;
}
