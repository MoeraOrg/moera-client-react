import { useCallback, useSyncExternalStore } from 'react';

export function useMediaQuery(query: string) {
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

export function useIsTinyScreen() {
    return useMediaQuery("(max-width: 575px)");
}
