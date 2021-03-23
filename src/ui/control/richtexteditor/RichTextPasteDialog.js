import React from 'react';

import { ModalDialog } from "ui/control/ModalDialog";
import { Button } from "ui/control/Button";
import "./RichTextPasteDialog.css";

const RichTextPasteDialog = ({show, onSubmit}) => (
    show &&
        <ModalDialog title="Paste text with formatting" className="rich-text-paste-dialog"
                     onClose={() => onSubmit("none")}>
            <div className="modal-body">
                The clipboard contains text with formatting. Do you want to paste the text with formatting tags?
            </div>
            <div className="modal-footer">
                <Button variant="warning" onClick={() => onSubmit("text")}>Text only</Button>
                <Button variant="primary" onClick={() => onSubmit("html")}>Preserve formatting</Button>
            </div>
        </ModalDialog>
)

export default RichTextPasteDialog;
