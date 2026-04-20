// Based on react-image-lightbox 5.1.4 by Chris Fritz (MIT License).

import React, { useRef } from 'react';

import "./LightboxCaption.css";

interface Props {
    children: React.ReactNode;
}

export default function LightboxCaption({children}: Props) {
    const caption = useRef<HTMLDivElement | null>(null);

    const handleMousewheel = (event: React.WheelEvent<HTMLDivElement>): void => {
        event.stopPropagation();

        if (!caption.current) {
            return;
        }

        const {height} = caption.current.getBoundingClientRect();
        const {scrollHeight, scrollTop} = caption.current;
        if (
            (event.deltaY > 0 && height + scrollTop >= scrollHeight)
            || (event.deltaY < 0 && scrollTop <= 0)
        ) {
            event.preventDefault();
        }
    };

    return (
        <div
            onWheel={handleMousewheel}
            onMouseDown={event => event.stopPropagation()}
            className="lightbox-caption"
            ref={caption}
        >
            <div className="lightbox-caption-content">
                {children}
            </div>
        </div>
    );
}
