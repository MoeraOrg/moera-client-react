// Based on react-image-lightbox 5.1.4 by Chris Fritz (MIT License).

import { useCallback, useEffect, useSyncExternalStore } from 'react';

import { LightboxCachedImage, LightboxImageCache } from "ui/react-image-lightbox/lightbox-image-cache";
import { ElementSize } from "ui/hook";

const IMAGE_PADDING_PX = 10;

export type ImageInfo = {
    src: string;
    width: number;
    height: number;
    targetWidth: number;
    targetHeight: number;
    error: false;
} | {
    src: string;
    width: undefined;
    height: undefined;
    targetWidth: undefined;
    targetHeight: undefined;
    error: true;
}

export function useLightboxImageLoader(
    src: string | null | undefined,
    imageCache: LightboxImageCache,
    boxSize: ElementSize
): ImageInfo | null {
    useEffect(() => {
        if (src == null || imageCache.get(src)?.loaded) {
            return;
        }

        const inMemoryImage = new Image();

        const onError = (): void =>
            imageCache.put(src, {error: true});

        const onLoad = (): void =>
            imageCache.put(src, {
                loaded: true,
                width: inMemoryImage.width,
                height: inMemoryImage.height
            });

        inMemoryImage.addEventListener("error", onError, {once: true});
        inMemoryImage.addEventListener("load", onLoad, {once: true});

        inMemoryImage.src = src;

        return () => {
            inMemoryImage.removeEventListener("error", onError);
            inMemoryImage.removeEventListener("load", onLoad);
        };
    }, [imageCache, src]);

    const subscribe = useCallback((callback: () => void): () => void => {
        if (src == null) {
            return () => {};
        }

        return imageCache.subscribe(src, callback);
    }, [imageCache, src]);

    const getSnapshot = useCallback((): LightboxCachedImage | undefined => {
        if (src == null) {
            return undefined;
        }

        return imageCache.get(src);
    }, [imageCache, src]);

    const getFitSizes = (width: number, height: number): ElementSize => {
        let maxHeight = boxSize.height - IMAGE_PADDING_PX * 2;
        let maxWidth = boxSize.width - IMAGE_PADDING_PX * 2;

        maxHeight = Math.min(maxHeight, height);
        maxWidth = Math.min(maxWidth, width);

        const maxRatio = maxWidth / maxHeight;
        const srcRatio = width / height;

        if (maxRatio > srcRatio) {
            return {
                width: (width * maxHeight) / height,
                height: maxHeight
            };
        }

        return {
            width: maxWidth,
            height: (height * maxWidth) / width
        };
    };

    const image = useSyncExternalStore(subscribe, getSnapshot);

    if (src == null || image === undefined || !image.loaded) {
        return null;
    }

    if (image.error) {
        return {
            src,
            height: undefined,
            width: undefined,
            targetWidth: undefined,
            targetHeight: undefined,
            error: true
        };
    }

    const fitSizes = getFitSizes(image.width, image.height);

    return {
        src,
        height: image.height,
        width: image.width,
        targetHeight: fitSizes.height,
        targetWidth: fitSizes.width,
        error: false
    };
}
