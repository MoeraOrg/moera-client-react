import React from 'react';

import { OverlayProps, OverlayZIndex, useOverlay } from "ui/overlays/overlays";

interface Props<E extends Element> {
    id: string;
    elementRef: React.RefObject<E> | E | null;
    props: Partial<OverlayProps>;
    children: (zIndex: OverlayZIndex | undefined) => any;
}

export default function Overlay<E extends Element>({id, elementRef, props, children}: Props<E>) {
    return children(useOverlay(id, elementRef, props));
}
