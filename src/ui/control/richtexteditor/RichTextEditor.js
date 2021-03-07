import React from 'react';
import PropType from 'prop-types';
import cx from 'classnames';

import RichTextArea from "ui/control/richtexteditor/RichTextArea";
import RichTextEditorPanel from "ui/control/richtexteditor/RichTextEditorPanel";
import "./RichTextEditor.css";

const RichTextEditor = ({name, value, rows, placeholder, className, autoFocus, autoComplete, disabled, smileysEnabled,
                         hidingPanel, format, onKeyDown, onChange, onBlur}) => {
    const panel = React.createRef();
    const textArea = React.createRef();
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

RichTextEditor.propTypes = {
    name: PropType.string,
    value: PropType.string,
    rows: PropType.number,
    placeholder: PropType.string,
    className: PropType.string,
    autoFocus: PropType.bool,
    autoComplete: PropType.string,
    disabled: PropType.bool,
    smileysEnabled: PropType.bool,
    hidingPanel: PropType.bool,
    format: PropType.string,
    onKeyDown: PropType.func,
    onChange: PropType.func,
    onBlur: PropType.func
};

export { RichTextEditor };
