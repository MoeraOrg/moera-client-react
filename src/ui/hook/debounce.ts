import React from "react";

export function useForcibleDebounce<T>(value: T, delay: number): [T, React.Dispatch<React.SetStateAction<T>>] {
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
