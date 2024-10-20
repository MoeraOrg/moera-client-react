import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from 'quill/ui/tooltip';
import { Blot } from 'parchment';

import Quill, { Range } from "ui/control/richtexteditor/visual/quill";

export type QuillTooltipSelectCallback = (formats: Record<string, unknown>, tooltipRoot: HTMLElement) => boolean;
export type QuillTooltipEditCallback = (selection: Range) => void;
export type QuillTooltipDeleteCallback = (selection: Range) => void;

interface QuillTooltipOptions {
    title?: string;
    onSelect?: QuillTooltipSelectCallback;
    onEdit?: QuillTooltipEditCallback;
    onDelete?: QuillTooltipDeleteCallback;
}

export default function useQuillTooltip<T extends Blot>(
    quill: Quill | null, tooltip: Tooltip | null, blotClass: new (...args: any[]) => T,
    options: QuillTooltipOptions = {}
) {
    const {title, onSelect: onSelectCallback, onEdit: onEditCallback, onDelete: onDeleteCallback} = options;

    const blotRange = useRef<Range | null>(null);
    const {t} = useTranslation();

    const onSelectionChange = useCallback((range: Range) => {
        if (quill == null || tooltip == null || onSelectCallback == null || range.length !== 0) {
            return;
        }

        const show = onSelectCallback(quill.getFormat(range) ?? {}, tooltip?.root);
        if (show) {
            tooltip.show();
            const [blot, offset] = quill.scroll.descendant(blotClass, range.index);
            if (blot != null) {
                blotRange.current = new Range(range.index - offset, blot.length());
                const bounds = quill.getBounds(blotRange.current);
                if (bounds) {
                    tooltip.position(bounds);
                }
            }
        } else {
            tooltip.hide();
            blotRange.current = null;
        }
    }, [blotClass, onSelectCallback, quill, tooltip]);

    useEffect(() => {
        if (quill != null) {
            quill.on("selection-change", onSelectionChange);
            return () => {
                quill.off("selection-change", onSelectionChange);
            }
        }
    }, [quill, onSelectionChange]);

    useEffect(() => {
        if (quill != null && title != null) {
            const element = tooltip?.root.querySelector(".title");
            if (element) {
                element.textContent = t(title);
            }
        }
    }, [quill, t, title, tooltip]);

    const onEdit = useCallback((event: Event) => {
        if (quill != null && tooltip != null && blotRange.current != null && onEditCallback != null) {
            quill.focus();
            tooltip.hide();
            onEditCallback(blotRange.current);
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
        if (quill != null && tooltip != null && blotRange.current != null && onDeleteCallback != null) {
            quill.focus();
            onDeleteCallback(blotRange.current);
            tooltip.hide();
            blotRange.current = null;
        }
        event.preventDefault();
    }, [onDeleteCallback, quill, tooltip]);

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
