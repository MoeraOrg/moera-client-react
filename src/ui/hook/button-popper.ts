import { useCallback, useState } from 'react';
import { arrow, flip, shift, useFloating } from '@floating-ui/react';
import { Placement } from '@floating-ui/utils';

import { useOverlay } from "ui/overlays/overlays";

type ButtonPopperOptions = {
    closeOnSelect?: boolean;
    parentOverlayId?: string;
}

export function useButtonPopper(placement?: Placement, options: ButtonPopperOptions = {}) {
    const [visible, setVisible] = useState(false);

    // Such usage of useState() is counter-intuitive, but required by floating-ui
    const [arrowRef, setArrowRef] = useState<HTMLElement | null>(null);
    const {
        refs, floatingStyles, update, placement: finalPlacement, middlewareData
    } = useFloating({placement, middleware: [flip(), shift(), arrow({element: arrowRef})]});

    const onToggle = (event: {preventDefault: () => void}) => {
        setVisible(visible => !visible);
        event.preventDefault();
    };

    // setTimeout() is needed here to make hide(), invoked from overlay.onClosed, to be called after onToggle,
    // invoked by the target button, and after menu selection
    const hide = useCallback(() => setTimeout(() => setVisible(false)), []);

    const [zIndex, overlayId] = useOverlay(
        refs.floating,
        {parentId: options.parentOverlayId, visible, onClose: hide, closeOnSelect: options.closeOnSelect ?? true}
    );

    return {
        visible,
        setVisible,
        hide,
        popperUpdate: update,
        onToggle,
        setButtonRef: refs.setReference,
        setPopperRef: refs.setFloating,
        setArrowRef,
        popperStyles: floatingStyles,
        arrowStyles: {
            position: "absolute" as const,
            left: middlewareData.arrow?.x,
            top: middlewareData.arrow?.y
        },
        placement: finalPlacement.split("-")[0],
        zIndex,
        overlayId
    };
}
