import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "./RichTextEditorButton.css";

const RichTextEditorButton = ({icon, title, letter, onClick}) => (
    <button className="rich-text-editor-button" title={letter ? `${title} (Ctrl-${letter})` : title}
            data-letter={letter} onClick={onClick}>
        <FontAwesomeIcon icon={icon}/>
    </button>
)

export default RichTextEditorButton;
