import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, ModalDialog } from "ui/control";
import { useParent } from "ui/hook";
import "./MarkdownPasteDialog.css";

export type RichTextPasteMode = "none" | "text" | "html";

interface Props {
    onSubmit: (mode: RichTextPasteMode, persist: boolean) => void;
}

export default function MarkdownPasteDialog({onSubmit}: Props) {
    const [persist, setPersist] = useState(false);
    const {t} = useTranslation();

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "t" || event.key === "\u0435" || event.key === "\u05d0") {
            onSubmit("text", persist);
            event.preventDefault();
        }
        if (event.key === "p" || event.key === "\u0437" || event.key === "\u05e4") {
            onSubmit("html", persist);
            event.preventDefault();
        }
    }

    const {overlayId: parentOverlayId} = useParent();

    return (
        <ModalDialog title={t("paste-with-formatting")} className="rich-text-paste-dialog"
                     parentOverlayId={parentOverlayId} onKeyDown={onKeyDown} onClose={() => onSubmit("none", false)}>
            <div className="modal-body">
                {t("clipboard-contains-formatting")}
                <div className="check">
                    <label>
                        <input type="checkbox" checked={persist} onChange={() => setPersist(!persist)}/>
                        {t("dont-ask-next-time")}
                    </label>
                </div>
            </div>
            <div className="modal-footer">
                <Button variant="warning" onClick={() => onSubmit("text", persist)}>
                    {t("text-only")} (t)
                </Button>
                <Button variant="primary" onClick={() => onSubmit("html", persist)}>
                    {t("preserve-formatting")} (p)
                </Button>
            </div>
        </ModalDialog>
    );
}
