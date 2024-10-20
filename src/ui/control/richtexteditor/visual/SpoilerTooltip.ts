import { useCallback, useEffect, useRef, useState } from 'react';
import Tooltip from 'quill/ui/tooltip';

import Quill, { Range } from "ui/control/richtexteditor/visual/quill";
import Spoiler from "ui/control/richtexteditor/visual/Spoiler";
import useQuillTooltip, {
    QuillTooltipDeleteCallback,
    QuillTooltipEditCallback,
    QuillTooltipSelectCallback
} from "ui/control/richtexteditor/visual/quill-tooltip";

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
    const spoilerText = useRef<string | undefined>(undefined);

    useEffect(() => {
        if (quill != null) {
            setTooltip(new SpoilerTooltip(quill));
            return () => setTooltip(null);
        }
    }, [quill]);

    const onSelect = useCallback<QuillTooltipSelectCallback>((formats, tooltipRoot) => {
        spoilerText.current = formats.spoiler as string | undefined;
        if (spoilerText.current) {
            const element = tooltipRoot.querySelector(".spoiler-title");
            if (element) {
                element.textContent = spoilerText.current;
            }
            return true;
        } else {
            return false;
        }
    }, []);

    const onEdit = useCallback<QuillTooltipEditCallback>(
        selection => onEditCallback && onEditCallback(selection, spoilerText.current ?? ""),
        [onEditCallback]
    );

    const onDelete = useCallback<QuillTooltipDeleteCallback>(
        selection => quill?.formatText(selection, "spoiler", false, "user"),
        [quill]
    );

    useQuillTooltip(quill, tooltip, Spoiler, {title: "spoiler", onSelect, onEdit, onDelete});
}
