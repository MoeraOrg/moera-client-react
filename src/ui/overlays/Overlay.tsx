import React from 'react';

import { OverlayProps, OverlayZIndex, useOverlay } from "ui/overlays/overlays";

interface Props<E extends Element> {
    elementRef: React.RefObject<E> | E | null;
    props: Partial<OverlayProps>;
    children: (zIndex: OverlayZIndex | undefined, id: string) => any;
}

export default function Overlay<E extends Element>({elementRef, props, children}: Props<E>) {
    const [zIndex, id] = useOverlay(elementRef, props);
    return children(zIndex, id);
}
