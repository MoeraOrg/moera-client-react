import React, { ForwardedRef, forwardRef, MouseEventHandler } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import cx from 'classnames';

import Twemoji from "ui/twemoji/Twemoji";

interface Props {
    icon?: IconProp | null;
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
        {icon && <FontAwesomeIcon icon={icon}/>}
        {emoji && <Twemoji code={emoji}/>}
        <span className="caption">{caption}</span>
    </button>
));

export { EmojiButton };
