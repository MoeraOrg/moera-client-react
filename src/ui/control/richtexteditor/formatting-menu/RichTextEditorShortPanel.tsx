import React, { ReactNode } from 'react';

import FormattingMenuButton from "ui/control/richtexteditor/formatting-menu/FormattingMenuButton";
import "./RichTextEditorShortPanel.css";

interface Props {
    children?: ReactNode;
}

const RichTextEditorShortPanel = ({children}: Props) => (
    <div className="rich-text-editor-short-panel">
        <FormattingMenuButton/>
        {children}
    </div>
);

export default RichTextEditorShortPanel;
