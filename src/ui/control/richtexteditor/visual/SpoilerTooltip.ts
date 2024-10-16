import { useCallback, useEffect, useRef } from 'react';
import Tooltip from 'quill/ui/tooltip';

import Quill, { Range } from "ui/control/richtexteditor/visual/quill";
import Spoiler from "ui/control/richtexteditor/visual/Spoiler";
import "./SpoilerTooltip.css";

class SpoilerTooltip extends Tooltip {

    static TEMPLATE = "\"<span class='spoiler-title'></span>\"";

}

export default function useSpoilerTooltip(quill: Quill | null) {
    const tooltip = useRef<SpoilerTooltip | null>(null);

    const spoilerSpy = useCallback((range: Range) => {
        if (quill == null || tooltip.current == null) {
            return;
        }

        const spoilerText = quill.getFormat(range)?.spoiler as string | undefined;
        if (spoilerText) {
            const title = tooltip.current?.root.querySelector(".spoiler-title");
            if (title) {
                title.textContent = spoilerText;
            }
            tooltip.current.show();
            const [spoiler, offset] = quill.scroll.descendant(Spoiler, range.index);
            if (spoiler != null) {
                const bounds = quill.getBounds(new Range(range.index - offset, spoiler.length()));
                if (bounds) {
                    tooltip.current.position(bounds);
                }
            }
        } else {
            tooltip.current.hide();
        }
    }, [quill]);

    useEffect(() => {
        if (quill != null) {
            tooltip.current = new SpoilerTooltip(quill);
            quill.on("selection-change", spoilerSpy);
            return () => {
                quill.off("selection-change", spoilerSpy)
                tooltip.current = null;
            }
        }
    }, [spoilerSpy, quill]);
}
