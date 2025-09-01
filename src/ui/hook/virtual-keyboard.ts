import { useEffect, useState } from 'react';

const getVH = () => window.visualViewport ? window.visualViewport.height : window.innerHeight;

export function useVirtualKeyboard() {
    const [open, setOpen] = useState(false);
    const [vh, setVH] = useState<number | null>(null);

    useEffect(() => {
        let baseline: number | null = null;
        let isOpen = false;
        let rotationTimer: any;

        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
            || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

        const computeOpen = (v: number) => {
            if (baseline == null) {
                return false;
            }
            const drop = baseline - v;
            const rel  = drop / baseline;
            const focusedEditable = document.activeElement
                && (
                    (document.activeElement as HTMLElement).isContentEditable
                    || ["INPUT", "TEXTAREA"].includes(document.activeElement!.tagName)
                    || document.activeElement!.classList.contains("visual-text-area")
                );
            return drop >= 140 && rel >= 0.18 && (focusedEditable || isIOS);
        };

        const onResize = () => {
            const v = getVH();
            if (baseline == null) {
                baseline = v;
            }
            const next = computeOpen(v);
            if (next !== isOpen) {
                isOpen = next;
                setOpen(next);
            }
            setVH(v);
        };

        const onOrientation = () => {
            clearTimeout(rotationTimer);
            rotationTimer = setTimeout(
                () => {
                    baseline = getVH();
                    onResize();
                },
                600
            );
        };

        const onFocus = () => setTimeout(onResize, 0);

        const onBlur  = () => setTimeout(
            () => {
                baseline = getVH();
                onResize();
            },
            250
        );

        if (window.visualViewport) {
            window.visualViewport.addEventListener("resize", onResize);
            window.visualViewport.addEventListener("scroll", onResize);
        } else {
            window.addEventListener("resize", onResize);
        }
        window.addEventListener("orientationchange", onOrientation);
        window.addEventListener("focus", onFocus, true);
        window.addEventListener("blur", onBlur, true);

        // init
        baseline = getVH();
        onResize();
        const t = setTimeout(
            () => {
                baseline = getVH();
                onResize();
            },
            300
        );

        return () => {
            if (window.visualViewport) {
                window.visualViewport.removeEventListener("resize", onResize);
                window.visualViewport.removeEventListener("scroll", onResize);
            } else {
                window.removeEventListener("resize", onResize);
            }
            window.removeEventListener("orientationchange", onOrientation);
            window.removeEventListener("focus", onFocus, true);
            window.removeEventListener("blur", onBlur, true);
            clearTimeout(rotationTimer);
            clearTimeout(t);
        };
    }, []);

    return { open, vh }; // vh is visual viewport height in px
}
