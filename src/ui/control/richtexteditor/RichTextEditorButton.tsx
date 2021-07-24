import React from 'react';
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "./RichTextEditorButton.css";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface Props {
    icon: IconProp;
    title: string;
    letter?: string;
    className?: string;
    onClick?: (event: React.MouseEvent) => void;
}

const RichTextEditorButton = ({icon, title, letter, className, onClick}: Props) => (
    <button className={cx("rich-text-editor-button", className)} title={letter ? `${title} (Ctrl-${letter})` : title}
            data-letter={letter} onClick={onClick}>
        <FontAwesomeIcon icon={icon}/>
    </button>
)

export default RichTextEditorButton;
