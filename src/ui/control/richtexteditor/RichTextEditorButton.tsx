import React, { ForwardedRef, forwardRef } from 'react';
import cx from 'classnames';

import { Icon, MaterialSymbol } from "ui/material-symbols";
import "./RichTextEditorButton.css";

interface Props {
    icon: MaterialSymbol;
    title: string;
    letter?: string;
    className?: string;
    active?: boolean;
    onClick?: (event: React.MouseEvent) => void;
}

const RichTextEditorButtonImpl = (
    {icon, title, letter, className, active, onClick}: Props, ref: ForwardedRef<HTMLButtonElement>
) => (
    <button className={cx("rich-text-editor-button", className, {active})}
            title={letter ? `${title} (Ctrl-${letter})` : title}
            data-letter={letter} onClick={onClick} ref={ref}>
        {icon && <Icon icon={icon}/>}
    </button>
)

const RichTextEditorButton = forwardRef(RichTextEditorButtonImpl);

export default RichTextEditorButton;
