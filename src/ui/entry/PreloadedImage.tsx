import React, { useEffect, useRef, useState } from 'react';

import ImagePlaceholder from "ui/entry/ImagePlaceholder";

interface Props {
    src: string;
    srcSet: string;
    sizes: string;
    width: number;
    height: number;
    alt?: string;
    title?: string;
    className?: string;
}

interface ImageSource {
    src: string;
    srcSet: string;
    sizes: string;
}

export default function PreloadedImage({src, srcSet, sizes, width, height, alt, title, className}: Props) {
    const [displayedSource, setDisplayedSource] = useState<ImageSource | null>(null);

    const generation = useRef(0);

    useEffect(() => {
        const currentGeneration = ++generation.current;

        const source: ImageSource = {src, srcSet, sizes};
        const image = new Image();

        let cancelled = false;

        image.onload = async () => {
            try {
                await image.decode();
            } catch {
                // Some browsers/formats may reject decode() even after a successful load.
                // In this case we still consider the image loaded.
            }

            if (!cancelled && currentGeneration === generation.current) {
                setDisplayedSource(source);
            }
        };

        image.onerror = () => {
            // Do nothing:
            //
            // - if the image hasn't been shown yet, the placeholder will remain;
            // - if the old image is already shown, it will continue to be displayed.
        };

        // Important: set responsive-image parameters before src.
        image.sizes = sizes;
        image.srcset = srcSet;
        image.src = src;

        return () => {
            cancelled = true;
            image.onload = null;
            image.onerror = null;
        };
    }, [src, srcSet, sizes]);

    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const figure = imgRef.current?.closest("figure");
        if (figure) {
            figure.style.setProperty("--width", `${width}px`);
        }
    }, [width]);

    const style = {
        "--width": `${width}px`,
        "--height": `${height}px`,
        "--aspect-ratio": `${width / height}`,
    } as React.CSSProperties;

    if (displayedSource === null) {
        return (
            <ImagePlaceholder
                width={width}
                height={height}
                alt={alt ?? ""}
                title={title}
                className={className}
            />
        );
    }

    return (
        <img
            ref={imgRef}
            src={displayedSource.src}
            srcSet={displayedSource.srcSet}
            sizes={displayedSource.sizes}
            width={width}
            height={height}
            alt={alt ?? ""}
            title={title}
            className={className}
            style={style}
        />
    );
}