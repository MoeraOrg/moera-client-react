import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from 'quill/ui/tooltip';

import Quill, { Range } from "ui/control/richtexteditor/visual/quill";
import Spoiler from "ui/control/richtexteditor/visual/Spoiler";

class SpoilerTooltip extends Tooltip {

    static TEMPLATE = [
        '<span class="title"></span>',
        '"<span class="spoiler-title"></span>"',
        '<a class="ql-action"></a>',
        '<a class="ql-remove"></a>',
    ].join('');

}

export type SpoilerEditCallback = (selection: Range, title: string) => void;

export default function useSpoilerTooltip(quill: Quill | null, onEditCallback?: SpoilerEditCallback) {
    const [tooltip, setTooltip] = useState<SpoilerTooltip | null>(null);
    const blotRange = useRef<Range | null>(null);
    const spoilerText = useRef<string | undefined>(undefined);
    const {t} = useTranslation();

    useEffect(() => {
        if (quill != null) {
            setTooltip(new SpoilerTooltip(quill));
            return () => setTooltip(null);
        }
    }, [quill]);

    const spoilerSpy = useCallback((range: Range) => {
        if (quill == null || tooltip == null) {
            return;
        }

        spoilerText.current = quill.getFormat(range)?.spoiler as string | undefined;
        if (spoilerText.current) {
            const element = tooltip?.root.querySelector(".spoiler-title");
            if (element) {
                element.textContent = spoilerText.current;
            }
            tooltip.show();
            const [spoiler, offset] = quill.scroll.descendant(Spoiler, range.index);
            if (spoiler != null) {
                blotRange.current = new Range(range.index - offset, spoiler.length());
                const bounds = quill.getBounds(blotRange.current);
                if (bounds) {
                    tooltip.position(bounds);
                }
            }
        } else {
            tooltip.hide();
            blotRange.current = null;
        }
    }, [quill, tooltip]);

    useEffect(() => {
        if (quill != null) {
            quill.on("selection-change", spoilerSpy);
            return () => {
                quill.off("selection-change", spoilerSpy);
            }
        }
    }, [quill, spoilerSpy]);

    useEffect(() => {
        if (quill != null) {
            const element = tooltip?.root.querySelector(".title");
            if (element) {
                element.textContent = t("spoiler");
            }
        }
    }, [quill, t, tooltip]);

    const onEdit = useCallback((event: Event) => {
        if (quill != null && tooltip != null && blotRange.current != null && onEditCallback != null) {
            quill.focus();
            tooltip.hide();
            onEditCallback(blotRange.current, spoilerText.current ?? "");
        }
        event.preventDefault();
    }, [onEditCallback, quill, tooltip]);

    useEffect(() => {
        if (quill != null) {
            const element = tooltip?.root.querySelector(".ql-action");
            if (element) {
                element.textContent = t("edit");
                element.addEventListener("click", onEdit);
                return () => element.removeEventListener("click", onEdit);
            }
        }
    }, [onEdit, quill, t, tooltip]);

    const onDelete = useCallback((event: Event) => {
        if (quill != null && tooltip != null && blotRange.current != null) {
            quill.focus();
            quill.formatText(blotRange.current, "spoiler", false, "user");
            tooltip.hide();
            blotRange.current = null;
        }
        event.preventDefault();
    }, [quill, tooltip]);

    useEffect(() => {
        if (quill != null) {
            const element = tooltip?.root.querySelector(".ql-remove");
            if (element) {
                element.textContent = t("delete");
                element.addEventListener("click", onDelete);
                return () => element.removeEventListener("click", onDelete);
            }
        }
    }, [onDelete, quill, t, tooltip]);
}
