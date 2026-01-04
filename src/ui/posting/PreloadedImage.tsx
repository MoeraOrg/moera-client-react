import React, { useEffect, useRef, useState } from 'react';

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
        window.loadedImages = new Set();
    }

    const [loaded, setLoaded] = useState(window.loadedImages.has(src));

    const onLoad = () => {
        setLoaded(true);
        window.loadedImages?.add(src);
    }

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

    return (
        <>
            {!loaded &&
                <img width={width} height={height} alt={alt ?? ""} title={title} style={style}
                     className="preload-placeholder"/>
            }
            <img ref={imgRef} src={src} srcSet={srcSet} sizes={sizes} width={width} height={height} alt={alt ?? ""}
                 title={title} className={className} style={loaded ? style : {display: "none"}} onLoad={onLoad}/>
        </>
    );
}
