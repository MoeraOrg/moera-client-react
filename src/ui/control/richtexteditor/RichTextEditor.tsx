import React, { useCallback, useRef } from 'react';
import cx from 'classnames';

import { PrivateMediaFileInfo } from "api/node/api-types";
import RichTextArea, { RichTextAreaProps } from "ui/control/richtexteditor/RichTextArea";
import RichTextEditorPanel from "ui/control/richtexteditor/RichTextEditorPanel";
import RichTextEditorDropzone from "ui/control/richtexteditor/RichTextEditorDropzone";
import "./RichTextEditor.css";

export class RichTextValue {

    text: string;
    media?: PrivateMediaFileInfo[] | null;

    constructor(text: string, media?: PrivateMediaFileInfo[] | null) {
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

    const onImageAdded = (image: PrivateMediaFileInfo) => {
        if (onChange != null && value.media != null) {
            const media = value.media.filter(v => v.id !== image.id);
            media.push(image);
            onChange(new RichTextValue(value.text, media));
        }
    }

    const onImageDeleted = (id: string) => {
        if (onChange != null && value.media != null) {
            const media = value.media.filter(v => v.id !== id);
            onChange(new RichTextValue(value.text, media));
        }
    }

    // useCallback() is mandatory here
    const onTextChange = useCallback(() => {
        if (onChange != null && textArea.current != null) {
            onChange(new RichTextValue(textArea.current.value, value.media));
        }
    }, [onChange, value.media]);

    return (
        <div className={cx("rich-text-editor", className)}>
            <RichTextEditorPanel panel={panel} textArea={textArea} hiding={hidingPanel} format={format}
                                 noMedia={noMedia} onImageAdded={onImageAdded} onImageDeleted={onImageDeleted}/>
            <RichTextArea name={name} value={value.text} format={format} rows={rows} placeholder={placeholder}
                          autoFocus={autoFocus} autoComplete={autoComplete} disabled={disabled}
                          smileysEnabled={smileysEnabled} onKeyDown={onKeyDown} onChange={onTextChange} onBlur={onBlur}
                          textArea={textArea} panel={panel}/>
            {!noMedia &&
                <RichTextEditorDropzone value={value}/>
            }
        </div>
    );
};

export { RichTextEditor };
