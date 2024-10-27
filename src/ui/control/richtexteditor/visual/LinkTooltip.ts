import { useCallback, useEffect, useRef, useState } from 'react';
import Quill, { Range } from 'quill';
import LinkBlot from 'quill/formats/link';
import Tooltip from 'quill/ui/tooltip';

import useQuillTooltip, {
    QuillTooltipDeleteCallback,
    QuillTooltipEditCallback,
    QuillTooltipSelectCallback
} from "ui/control/richtexteditor/visual/quill-tooltip";

class LinkTooltip extends Tooltip {

    static TEMPLATE = [
        '<span class="title"></span>',
        '<a class="ql-preview" rel="noopener noreferrer" target="_blank" href="about:blank"></a>',
        '<a class="ql-action"></a>',
        '<a class="ql-remove"></a>',
    ].join('');

}

export type LinkEditCallback = (selection: Range, href: string) => void;

export default function useLinkTooltip(quill: Quill | null, onEditCallback?: LinkEditCallback) {
    const [tooltip, setTooltip] = useState<LinkTooltip | null>(null);
    const href = useRef<string | undefined>(undefined);

    useEffect(() => {
        if (quill != null) {
            setTooltip(new LinkTooltip(quill));
            return () => setTooltip(null);
        }
    }, [quill]);

    const onSelect = useCallback<QuillTooltipSelectCallback>((formats, tooltipRoot) => {
        href.current = formats.link as string | undefined;
        if (href.current) {
            const element = tooltipRoot.querySelector("a.ql-preview");
            if (element) {
                element.setAttribute("href", href.current)
                element.textContent = href.current;
            }
            return true;
        } else {
            return false;
        }
    }, []);

    const onEdit = useCallback<QuillTooltipEditCallback>(
        selection => onEditCallback && onEditCallback(selection, href.current ?? ""),
        [onEditCallback]
    );

    const onDelete = useCallback<QuillTooltipDeleteCallback>(
        selection => quill?.formatText(selection, "link", false, "user"),
        [quill]
    );

    useQuillTooltip(quill, tooltip, LinkBlot, {title: "open-link", onSelect, onEdit, onDelete});
}
