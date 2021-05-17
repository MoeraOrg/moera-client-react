import React, { useState } from 'react';

import { ModalDialog } from "ui/control/ModalDialog";
import { Button } from "ui/control/Button";
import "./RichTextPasteDialog.css";

export default function RichTextPasteDialog({show, onSubmit}) {
    const [persist, setPersist] = useState(false);

    if (!show) {
        return null;
    }

    return (
        <ModalDialog title="Paste text with formatting" className="rich-text-paste-dialog"
                     onClose={() => onSubmit("none", false)}>
            <div className="modal-body">
                The clipboard contains text with formatting. Do you want to paste the text with formatting tags?
                <div className="check">
                    <label>
                        <input type="checkbox" checked={persist} onChange={() => setPersist(!persist)}/>
                        Don't ask next time
                    </label>
                </div>
            </div>
            <div className="modal-footer">
                <Button variant="warning" onClick={() => onSubmit("text", persist)}>Text only</Button>
                <Button variant="primary" onClick={() => onSubmit("html", persist)}>Preserve formatting</Button>
            </div>
        </ModalDialog>
    );
}
