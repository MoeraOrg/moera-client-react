// Based on react-image-lightbox 5.1.4 by Chris Fritz (MIT License).

import { useCallback, useMemo, useRef } from "react";

export interface LightboxCachedImage {
    width: number;
    height: number;
    loaded: boolean;
    error: boolean;
}

type LightboxImageCacheListener = () => void;

export interface LightboxImageCache {
    get(src: string): LightboxCachedImage | undefined;
    put(src: string, image: Partial<LightboxCachedImage>): void;
    has(src: string): boolean;
    subscribe(src: string, callback: LightboxImageCacheListener): () => void;
}

export function useLightboxImageCache(): LightboxImageCache {
    const cacheRef = useRef<Record<string, LightboxCachedImage>>({});
    const listenersRef = useRef<Record<string, LightboxImageCacheListener[]>>({});

    const get = useCallback(
        (src: string): LightboxCachedImage | undefined => cacheRef.current[src],
        []
    );

    const put = useCallback((src: string, image: Partial<LightboxCachedImage>): void => {
        cacheRef.current[src] = { ...cacheRef.current[src], ...image };
        const listeners = listenersRef.current[src] ?? [];
        listeners.forEach(listener => listener());
    }, []);

    const has = useCallback(
        (src: string): boolean => src in cacheRef.current,
        []
    );

    const subscribe = useCallback((src: string, callback: LightboxImageCacheListener): () => void => {
        const listeners = listenersRef.current[src] ?? [];
        listeners.push(callback);
        listenersRef.current[src] = listeners;

        return () => {
            const listeners = listenersRef.current[src] ?? [];
            listenersRef.current[src] = listeners.filter(l => l !== callback);
        };
    }, []);

    return useMemo(() => ({ get, put, has, subscribe }), [get, put, has, subscribe]);
}
