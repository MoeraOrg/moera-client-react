import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from 'quill/ui/tooltip';

import Quill, { Range } from "ui/control/richtexteditor/visual/quill";
import Spoiler from "ui/control/richtexteditor/visual/Spoiler";
import "./SpoilerTooltip.css";

class SpoilerTooltip extends Tooltip {

    static TEMPLATE = [
        '<span class="title"></span>',
        '"<span class="spoiler-title"></span>"',
        '<a class="ql-action"></a>',
        '<a class="ql-remove"></a>',
    ].join('');

}

export default function useSpoilerTooltip(quill: Quill | null) {
    const tooltip = useRef<SpoilerTooltip | null>(null);

    const {t} = useTranslation();

    const spoilerSpy = useCallback((range: Range) => {
        if (quill == null || tooltip.current == null) {
            return;
        }

        const spoilerText = quill.getFormat(range)?.spoiler as string | undefined;
        if (spoilerText) {
            assignText(tooltip.current, ".spoiler-title", spoilerText);
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
            assignText(tooltip.current, ".title", t("spoiler"));
            assignText(tooltip.current, ".ql-action", t("edit"));
            assignText(tooltip.current, ".ql-remove", t("delete"));
            quill.on("selection-change", spoilerSpy);
            return () => {
                quill.off("selection-change", spoilerSpy)
                tooltip.current = null;
            }
        }
    }, [spoilerSpy, quill, t]);
}

function assignText(tooltip: SpoilerTooltip | null, query: string, text: string) {
    const element = tooltip?.root.querySelector(query);
    if (element) {
        element.textContent = text;
    }
}
