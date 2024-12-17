import React, { ForwardedRef, forwardRef } from 'react';
import cx from 'classnames';

import { Icon, MaterialSymbol } from "ui/material-symbols";
import "./RichTextEditorButton.css";

interface Props {
    icon: MaterialSymbol;
    title: string;
    hotkey?: string;
    className?: string;
    active?: boolean;
    onClick?: (event: React.MouseEvent) => void;
}

const RichTextEditorButtonImpl = (
    {icon, title, hotkey, className, active, onClick}: Props, ref: ForwardedRef<HTMLButtonElement>
) => (
    <button className={cx("rich-text-editor-button", className, {active})}
            title={hotkey ? `${title} (${hotkey})` : title} data-hotkey={hotkey} onClick={onClick} ref={ref}>
        {icon && <Icon icon={icon}/>}
    </button>
)

const RichTextEditorButton = forwardRef(RichTextEditorButtonImpl);

export default RichTextEditorButton;
