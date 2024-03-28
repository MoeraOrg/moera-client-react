import { useCallback, useState } from 'react';
import { usePopper } from 'react-popper';
import { Options, Placement } from '@popperjs/core';

import { useOverlay } from "ui/overlays/overlays";

type ButtonPopperOptions = Partial<Options> & {
    hideAlways?: boolean;
}

export function useButtonPopper(placement: Placement, options: ButtonPopperOptions = {}) {
    const [visible, setVisible] = useState(false);

    // Such usage of useState() is counter-intuitive, but required by react-popper
    const [buttonRef, setButtonRef] = useState<Element | null>(null);
    const [popperRef, setPopperRef] = useState<HTMLElement | null>(null);
    const [arrowRef, setArrowRef] = useState<HTMLElement | null>(null);
    const {styles, attributes, state} = usePopper(buttonRef, popperRef,
        {placement, ...options, modifiers: [{name: "arrow", options: {element: arrowRef}}]});

    const onToggle = (event: {preventDefault: () => void}) => {
        setVisible(visible => !visible);
        event.preventDefault();
    };

    // setTimeout() is needed here to make hide(), invoked from overlay.onClosed, to be called after onToggle,
    // invoked by the target button, and after menu selection
    const hide = useCallback(() => setTimeout(() => setVisible(false)), []);

    const [zIndex] = useOverlay(popperRef, {visible, onClose: hide, closeOnSelect: options.hideAlways ?? true});

    return {
        visible, hide, onToggle, setButtonRef, setPopperRef, setArrowRef,
        popperStyles: styles ? styles.popper : {},
        popperAttributes: attributes ? attributes.popper : {},
        arrowStyles: styles && styles.arrow ? styles.arrow : {},
        placement: state ? state.placement.split("-")[0] : "",
        zIndex
    };
}
