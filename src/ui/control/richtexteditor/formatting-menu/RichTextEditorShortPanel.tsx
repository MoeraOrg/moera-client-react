import React, { ReactNode } from 'react';

import FormattingMenuButton from "ui/control/richtexteditor/formatting-menu/FormattingMenuButton";
import UndoRedoButton from "ui/control/richtexteditor/formatting-menu/UndoRedoButton";
import "./RichTextEditorShortPanel.css";

interface Props {
    children?: ReactNode;
}

const RichTextEditorShortPanel = ({children}: Props) => (
    <div className="rich-text-editor-short-panel">
        <div className="d-flex flex-nowrap">
            <FormattingMenuButton/>
            <UndoRedoButton/>
        </div>
        {children}
    </div>
);

export default RichTextEditorShortPanel;
