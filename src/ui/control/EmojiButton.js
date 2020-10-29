import React from 'react';
import PropType from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import { Twemoji } from "ui/control";

const EmojiButton = ({icon, emoji, caption, color, invisible, className, buttonRef, onMouseEnter, onMouseLeave,
                      onTouchStart, onClick}) => (
    <button className={cx(className, {"invisible": invisible})}  style={color ? {color} : null}
            onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onMouseDown={onMouseEnter}
            onTouchStart={onTouchStart} onClick={onClick} ref={buttonRef}>
        {icon && <FontAwesomeIcon icon={icon}/>}
        {emoji && <Twemoji code={emoji}/>}
        <span className="caption">{caption}</span>
    </button>
);

EmojiButton.propTypes = {
    icon: PropType.oneOfType([PropType.arrayOf(PropType.string), PropType.string]),
    emoji: PropType.number,
    caption: PropType.string,
    color: PropType.string,
    invisible: PropType.bool,
    className: PropType.string,
    buttonRef: PropType.any,
    onMouseEnter: PropType.func,
    onMouseLeave: PropType.func,
    onClick: PropType.func
};

export { EmojiButton };
