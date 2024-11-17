import React from 'react';
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import "./RichTextEditorButton.css";

interface Props {
    icon: IconProp;
    title: string;
    letter?: string;
    className?: string;
    active?: boolean;
    onClick?: (event: React.MouseEvent) => void;
}

const RichTextEditorButton = ({icon, title, letter, className, active, onClick}: Props) => (
    <button className={cx("rich-text-editor-button", className, {active})}
            title={letter ? `${title} (Ctrl-${letter})` : title}
            data-letter={letter} onClick={onClick}>
        <FontAwesomeIcon icon={icon}/>
    </button>
)

export default RichTextEditorButton;
