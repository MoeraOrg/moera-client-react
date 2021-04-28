import { useCallback, useEffect, useState } from 'react';
import { usePopper } from 'react-popper';

export function useButtonPopper() {
    const [visible, setVisible] = useState(false);

    const onToggle = useCallback(() => setVisible(visible => !visible), [setVisible]);
    const onHide = useCallback(() => setVisible(false), [setVisible]);
    useEffect(() => {
        if (visible) {
            document.getElementById("app-root").addEventListener("click", onHide);
            return () => {
                document.getElementById("app-root").removeEventListener("click", onHide);
            }
        }
    }, [visible, onHide])
    const [buttonRef, setButtonRef] = useState(null);
    const [popperRef, setPopperRef] = useState(null);
    const {styles, attributes} = usePopper(buttonRef, popperRef, {placement: "bottom-start"});

    return {
        visible, onToggle, setButtonRef, setPopperRef,
        popperStyles: styles ? styles.popper : {},
        popperAttributes: attributes ? attributes.popper : {}
    };
}
