import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "./RichTextEditorButton.css";

const RichTextEditorButton = ({icon}) => (
    <button className="rich-text-editor-button">
        <FontAwesomeIcon icon={icon}/>
    </button>
)

export default RichTextEditorButton;
