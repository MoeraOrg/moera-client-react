import React from 'react';

import RichTextEditorButton from "ui/control/richtexteditor/RichTextEditorButton";
import "./RichTextEditorPanel.css";

const RichTextEditorPanel = () => (
    <div className="rich-text-editor-panel">
        <div className="group">
            <RichTextEditorButton icon="bold"/>
            <RichTextEditorButton icon="italic"/>
            <RichTextEditorButton icon="strikethrough"/>
        </div>
        <div className="group">
            <RichTextEditorButton icon="exclamation-circle"/>
            <RichTextEditorButton icon="caret-square-down"/>
        </div>
        <div className="group">
            <RichTextEditorButton icon="quote-left"/>
        </div>
        <div className="group">
            <RichTextEditorButton icon="link"/>
            <RichTextEditorButton icon="image"/>
        </div>
    </div>
);

export default RichTextEditorPanel;
