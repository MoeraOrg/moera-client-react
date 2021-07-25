import React, { useRef } from 'react';
import cx from 'classnames';

import RichTextArea, { RichTextAreaProps } from "ui/control/richtexteditor/RichTextArea";
import RichTextEditorPanel from "ui/control/richtexteditor/RichTextEditorPanel";
import "./RichTextEditor.css";

type Props = {
    className?: string;
    hidingPanel?: boolean;
} & Omit<RichTextAreaProps, "textArea" | "panel">;

const RichTextEditor = ({name, value, rows, placeholder, className, autoFocus, autoComplete, disabled, smileysEnabled,
                         hidingPanel, format, onKeyDown, onChange, onBlur}: Props) => {
    const panel = useRef<HTMLDivElement>(null);
    const textArea = useRef<HTMLTextAreaElement>(null);
    return (
        <div className={cx("rich-text-editor", className)}>
            <RichTextEditorPanel panel={panel} textArea={textArea} hiding={hidingPanel} format={format}/>
            <RichTextArea name={name} value={value} format={format} rows={rows} placeholder={placeholder}
                          autoFocus={autoFocus} autoComplete={autoComplete} disabled={disabled}
                          smileysEnabled={smileysEnabled} onKeyDown={onKeyDown} onChange={onChange} onBlur={onBlur}
                          textArea={textArea} panel={panel}/>
        </div>
    );
};

export { RichTextEditor };
