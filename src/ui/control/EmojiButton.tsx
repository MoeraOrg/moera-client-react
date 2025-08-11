import React, { ForwardedRef, forwardRef, MouseEventHandler } from 'react';
import cx from 'classnames';

import { Icon, MaterialSymbol } from "ui/material-symbols";
import Twemoji from "ui/twemoji/Twemoji";

interface Props {
    icon?: MaterialSymbol | null;
    emoji?: number | null;
    caption?: string;
    color?: string | null;
    invisible?: boolean;
    className?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

const EmojiButton = forwardRef((
    {icon, emoji, caption, color, invisible, className, onClick}: Props,
    ref: ForwardedRef<HTMLButtonElement>
) => (
    <button className={cx(className, {"invisible": invisible})} style={color ? {color} : undefined} onClick={onClick}
            ref={ref}>
        {icon && <Icon icon={icon} size="1.2em"/>}
        {emoji && <Twemoji code={emoji}/>}
        <span className="caption">{caption}</span>
    </button>
));

export { EmojiButton };
