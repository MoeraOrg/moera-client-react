import React, { useEffect, useRef, useState } from 'react';
import ImagePlaceholder from "ui/entry/ImagePlaceholder";
import { urlWithoutParameters } from "util/url";

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

export default function PreloadedImage({src, srcSet, sizes, width, height, alt, title, className}: Props) {
    if (window.loadedImages == null) {
        window.loadedImages = new Map();
    }
    if (window.loadedImageUrls == null) {
        window.loadedImageUrls = new Set();
    }

    const [loaded, setLoaded] = useState(window.loadedImageUrls.has(src));

    const srcRef = useRef(src);
    srcRef.current = src;

    const onLoad = () => {
        window.loadedImageUrls?.add(src);
        if (srcRef.current === src) {
            const baseSrc = urlWithoutParameters(src, ["grant"]);
            window.loadedImages?.set(baseSrc, src);
            setLoaded(true);
        }
    }

    useEffect(() => {
        if (!window.loadedImageUrls?.has(src)) {
            setLoaded(false);
        }
    }, [src]);

    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const figure = imgRef.current?.closest("figure");
        if (figure) {
            figure.style.setProperty("--width", `${width}px`);
        }
    }, [width]);

    const style: React.CSSProperties = {
        "--width": `${width}px`,
        "--height": `${height}px`,
        "--aspect-ratio": `${width / height}`
    } as any;

    const baseSrc = urlWithoutParameters(src, ["grant"]);
    const baseSrcLoaded = window.loadedImages.has(baseSrc);

    return (
        <>
            {!loaded && !baseSrcLoaded &&
                <ImagePlaceholder width={width} height={height} alt={alt ?? ""} title={title} className={className}/>
            }
            {baseSrcLoaded &&
                <img src={window.loadedImages.get(baseSrc)} srcSet={srcSet} sizes={sizes} width={width} height={height}
                     alt={alt ?? ""} title={title} className={className} style={loaded ? {display: "none"} : style}/>
            }
            <img ref={imgRef} src={src} srcSet={srcSet} sizes={sizes} width={width} height={height} alt={alt ?? ""}
                 title={title} className={className} style={loaded ? style : {display: "none"}} onLoad={onLoad}/>
        </>
    );
}
