import React from 'react';
import cx from 'classnames';

interface Props {
    width: number;
    height: number;
    alt?: string;
    title?: string;
    className?: string;
}

export default function ImagePlaceholder({width, height, alt, title, className}: Props) {
    const style: React.CSSProperties = {
        "--width": `${width}px`,
        "--height": `${height}px`,
        "--aspect-ratio": `${width / height}`
    } as any;

    return <img width={width} height={height} alt={alt ?? ""} title={title} style={style}
                className={cx("preload-placeholder", className)}/>;
}
