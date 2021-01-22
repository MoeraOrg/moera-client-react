import React from 'react';
import PropType from 'prop-types';
import cx from 'classnames';

import RichTextArea from "ui/control/richtexteditor/RichTextArea";
import "./RichTextEditor.css";

const RichTextEditor = ({name, value, rows, placeholder, className, autoFocus, autoComplete, disabled, smileysEnabled,
                         onKeyDown, onChange, onBlur}) => (
    <div className={cx("rich-text-editor", className)}>
        <RichTextArea name={name} value={value} rows={rows} placeholder={placeholder} autoFocus={autoFocus}
                      autoComplete={autoComplete} disabled={disabled} smileysEnabled={smileysEnabled}
                      onKeyDown={onKeyDown} onChange={onChange} onBlur={onBlur}/>
    </div>
);

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
    onKeyDown: PropType.func,
    onChange: PropType.func,
    onBlur: PropType.func
};

export { RichTextEditor };
