import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { usePopper } from 'react-popper';

export function useButtonPopper(placement, options = {}) {
    const [visible, setVisible] = useState(false);

    const [buttonRef, setButtonRef] = useState(null);
    const [popperRef, setPopperRef] = useState(null);
    const [arrowRef, setArrowRef] = useState(null);
    const {styles, attributes} = usePopper(buttonRef, popperRef,
        {placement, ...options, modifiers: [{name: "arrow", options: {element: arrowRef}}]});

    const arrowStyles = styles && styles.arrow ? {
        ...styles.arrow,
        transform: styles.arrow.transform + " rotate(45deg)"
    } : {};

    const onToggle = event => {
        setVisible(visible => !visible);
        event.preventDefault();
    };

    const boxShown = useSelector(state => state.confirmBox.show || state.messageBox.show);
    const hideAlways = options.hideAlways ?? true;
    const onHide = useCallback(event => {
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
    }, [setVisible, hideAlways, popperRef, boxShown]);

    useEffect(() => {
        if (visible) {
            document.getElementById("app-root").addEventListener("click", onHide);
            document.getElementById("modal-root").addEventListener("click", onHide);
            return () => {
                document.getElementById("app-root").removeEventListener("click", onHide);
                document.getElementById("modal-root").removeEventListener("click", onHide);
            }
        }
    }, [visible, onHide])

    const hide = () => setVisible(false);

    return {
        visible, hide, onToggle, setButtonRef, setPopperRef, setArrowRef,
        popperStyles: styles ? styles.popper : {},
        popperAttributes: attributes ? attributes.popper : {},
        arrowStyles,
    };
}
