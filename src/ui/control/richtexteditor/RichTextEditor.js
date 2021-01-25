import React from 'react';
import PropType from 'prop-types';
import cx from 'classnames';

import RichTextArea from "ui/control/richtexteditor/RichTextArea";
import RichTextEditorPanel from "ui/control/richtexteditor/RichTextEditorPanel";
import "./RichTextEditor.css";

const RichTextEditor = ({name, value, rows, placeholder, className, autoFocus, autoComplete, disabled, smileysEnabled,
                         hidingPanel, onKeyDown, onChange, onBlur}) => {
    const textArea = React.createRef();
    return (
        <div className={cx("rich-text-editor", className)}>
            <RichTextEditorPanel textArea={textArea} hiding={hidingPanel}/>
            <RichTextArea name={name} value={value} rows={rows} placeholder={placeholder} autoFocus={autoFocus}
                          autoComplete={autoComplete} disabled={disabled} smileysEnabled={smileysEnabled}
                          onKeyDown={onKeyDown} onChange={onChange} onBlur={onBlur} textArea={textArea}/>
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
    onKeyDown: PropType.func,
    onChange: PropType.func,
    onBlur: PropType.func
};

export { RichTextEditor };
