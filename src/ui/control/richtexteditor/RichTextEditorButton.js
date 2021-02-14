import React from 'react';
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "./RichTextEditorButton.css";

const RichTextEditorButton = ({icon, title, letter, className, onClick}) => (
    <button className={cx("rich-text-editor-button", className)} title={letter ? `${title} (Ctrl-${letter})` : title}
            data-letter={letter} onClick={onClick}>
        <FontAwesomeIcon icon={icon}/>
    </button>
)

export default RichTextEditorButton;
