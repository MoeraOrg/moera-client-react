import { useCallback, useSyncExternalStore } from 'react';

const DESKTOP_WIDTH_QUERY = "(min-width: 992px)";

export function useMediaQuery(query: string): boolean {
    const subscribe = useCallback(
        (onStoreChange: () => void) => {
            const matchMedia = window.matchMedia(query);

            matchMedia.addEventListener("change", onStoreChange);
            return () => {
                matchMedia.removeEventListener("change", onStoreChange);
            };
        },
        [query]
    );

    const getSnapshot = () => window.matchMedia(query).matches;

    return useSyncExternalStore(subscribe, getSnapshot);
}

export function useIsTinyScreen(): boolean {
    return !useMediaQuery(DESKTOP_WIDTH_QUERY);
}

export function isTinyScreen(): boolean {
    return !window.matchMedia(DESKTOP_WIDTH_QUERY).matches;
}
