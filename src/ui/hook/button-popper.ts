import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { usePopper } from 'react-popper';
import { Options, Placement } from '@popperjs/core';

import { ClientState } from "state/state";

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

    const boxShown = useSelector<ClientState>(state => state.confirmBox.show || state.messageBox.show);
    const hideAlways = options.hideAlways ?? true;
    const onHide = useCallback((event: MouseEvent) => {
        if (boxShown) {
            return;
        }
        if (!hideAlways && popperRef) {
            const r = popperRef.getBoundingClientRect();
            if (r.left <= event.clientX && r.right >= event.clientX
                && r.top <= event.clientY && r.bottom >= event.clientY) {
                return;
            }
        }
        setVisible(false);
        event.preventDefault();
    }, [setVisible, hideAlways, popperRef, boxShown]) as EventListener;

    useEffect(() => {
        if (visible) {
            document.getElementById("app-root")!.addEventListener("click", onHide);
            document.getElementById("modal-root")!.addEventListener("click", onHide);
            document.getElementsByClassName("ReactModalPortal").item(0)?.addEventListener("click", onHide); // lightbox
            return () => {
                document.getElementById("app-root")!.removeEventListener("click", onHide);
                document.getElementById("modal-root")!.removeEventListener("click", onHide);
                document.getElementsByClassName("ReactModalPortal").item(0)?.removeEventListener("click", onHide);
            }
        }
    }, [visible, onHide])

    const hide = () => setVisible(false);

    return {
        visible, hide, onToggle, setButtonRef, setPopperRef, setArrowRef,
        popperStyles: styles ? styles.popper : {},
        popperAttributes: attributes ? attributes.popper : {},
        arrowStyles: styles && styles.arrow ? styles.arrow : {},
        placement: state ? state.placement.split("-")[0] : ""
    };
}
