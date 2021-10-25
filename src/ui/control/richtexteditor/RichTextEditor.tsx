import React, { useRef } from 'react';
import cx from 'classnames';

import RichTextArea, { RichTextAreaProps } from "ui/control/richtexteditor/RichTextArea";
import RichTextEditorPanel from "ui/control/richtexteditor/RichTextEditorPanel";
import "./RichTextEditor.css";

export class RichTextValue {

    text: string;
    media?: string[] | null;

    constructor(text: string, media?: string[] | null) {
        this.text = text;
        this.media = media;
    }

}

type Props = {
    className?: string;
    hidingPanel?: boolean;
    value: RichTextValue;
    onChange?: (value: RichTextValue) => void;
    noMedia?: boolean;
} & Omit<RichTextAreaProps, "textArea" | "panel" | "value" | "onChange">;

const RichTextEditor = ({name, value, rows, placeholder, className, autoFocus, autoComplete, disabled, smileysEnabled,
                         hidingPanel, format, onKeyDown, onChange, onBlur, noMedia}: Props) => {
    const panel = useRef<HTMLDivElement>(null);
    const textArea = useRef<HTMLTextAreaElement>(null);

    const onImageAdded = (id: string) => {
        if (onChange != null && value.media != null) {
            const media = value.media.filter(v => v !== id);
            media.push(id);
            onChange(new RichTextValue(value.text, media));
        }
    }

    const onImageDeleted = (id: string) => {
        if (onChange != null && value.media != null) {
            const media = value.media.filter(v => v !== id);
            onChange(new RichTextValue(value.text, media));
        }
    }

    const onTextChange = () => {
        if (onChange != null && textArea.current != null) {
            onChange(new RichTextValue(textArea.current.value, value.media));
        }
    }

    return (
        <div className={cx("rich-text-editor", className)}>
            <RichTextEditorPanel panel={panel} textArea={textArea} hiding={hidingPanel} format={format}
                                 noMedia={noMedia} onImageAdded={onImageAdded} onImageDeleted={onImageDeleted}/>
            <RichTextArea name={name} value={value.text} format={format} rows={rows} placeholder={placeholder}
                          autoFocus={autoFocus} autoComplete={autoComplete} disabled={disabled}
                          smileysEnabled={smileysEnabled} onKeyDown={onKeyDown} onChange={onTextChange} onBlur={onBlur}
                          textArea={textArea} panel={panel}/>
        </div>
    );
};

export { RichTextEditor };
