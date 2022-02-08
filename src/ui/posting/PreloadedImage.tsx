import React, { useState } from 'react';

interface Props {
    src: string;
    srcSet: string;
    sizes: string;
    width: number;
    height: number;
    alt?: string;
    title?: string;
}

export default function PreloadedImage({src, srcSet, sizes, width, height, alt, title}: Props) {
    if (window.loadedImages == null) {
        window.loadedImages = new Set();
    }

    const [loaded, setLoaded] = useState(window.loadedImages.has(src));

    const onLoad = () => {
        setLoaded(true);
        window.loadedImages?.add(src);
    }

    const style: React.CSSProperties = {
        "--width": `${width}px`,
        "--height": `${height}px`
    } as any;

    return (
        <>
            {!loaded &&
                <img width={width} height={height} alt={alt} title={title} style={style}
                     className="preload-placeholder"/>
            }
            <img src={src} srcSet={srcSet} sizes={sizes} width={width} height={height} alt={alt} title={title}
                 style={loaded ? style : {display: "none"}} onLoad={onLoad}/>
        </>
    );
}
