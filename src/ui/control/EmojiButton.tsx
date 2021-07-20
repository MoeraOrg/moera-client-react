import React, { MouseEventHandler, TouchEventHandler } from 'react';
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
    buttonRef?: React.Ref<HTMLButtonElement>;
    onMouseEnter?: MouseEventHandler<HTMLButtonElement>;
    onMouseLeave?: MouseEventHandler<HTMLButtonElement>;
    onTouchStart?: TouchEventHandler<HTMLButtonElement>;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

const EmojiButton = ({icon, emoji, caption, color, invisible, className, buttonRef, onMouseEnter, onMouseLeave,
                      onTouchStart, onClick}: Props) => (
    <button className={cx(className, {"invisible": invisible})} style={color ? {color} : undefined}
            onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onMouseDown={onMouseEnter}
            onTouchStart={onTouchStart} onClick={onClick} ref={buttonRef}>
        {icon && <FontAwesomeIcon icon={icon}/>}
        {emoji && <Twemoji code={emoji}/>}
        <span className="caption">{caption}</span>
    </button>
);

export { EmojiButton };
