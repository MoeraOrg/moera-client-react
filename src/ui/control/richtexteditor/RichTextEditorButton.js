import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "./RichTextEditorButton.css";

const RichTextEditorButton = ({icon, title, onClick}) => (
    <button className="rich-text-editor-button" title={title} onClick={onClick}>
        <FontAwesomeIcon icon={icon}/>
    </button>
)

export default RichTextEditorButton;
