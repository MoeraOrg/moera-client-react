import React, { useEffect } from 'react';

const FOCUSABLE_ELEMENT_SELECTOR = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled]):not([type=\"hidden\"])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[contenteditable=\"true\"]",
    "[tabindex]:not([tabindex=\"-1\"])"
].join(",");

export function useFocusTrap<E extends HTMLElement>(ref: React.RefObject<E | null>): void {
    useEffect(() => {
        const container = ref.current;
        if (container == null) {
            return;
        }

        const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        container.focus({preventScroll: true});

        const trapFocus = (event: KeyboardEvent): void => {
            if (event.key !== "Tab") {
                return;
            }

            const focusableElements = Array.from(
                container.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENT_SELECTOR)
            ).filter(element => element.tabIndex >= 0 && !element.hidden && element.getClientRects().length > 0);

            if (focusableElements.length === 0) {
                event.preventDefault();
                container.focus();
                return;
            }

            const first = focusableElements[0];
            const last = focusableElements[focusableElements.length - 1];
            const active = document.activeElement;
            const activeInside = active != null && active !== container && container.contains(active);

            if (!activeInside || (event.shiftKey && active === first) || (!event.shiftKey && active === last)) {
                event.preventDefault();
                (event.shiftKey ? last : first).focus();
            }
        };

        container.addEventListener("keydown", trapFocus);
        return () => {
            container.removeEventListener("keydown", trapFocus);
            previousFocus?.focus({preventScroll: true});
        };
    }, [ref]);
}
