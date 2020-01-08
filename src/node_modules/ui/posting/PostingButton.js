import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import { Twemoji } from "ui/control";
import "./PostingButton.css";

const PostingButton = ({icon, emoji, caption, color, invisible, buttonRef, onMouseEnter, onMouseLeave, onClick}) => (
    <div className={cx("posting-button", {"invisible": invisible})} onMouseEnter={onMouseEnter}
         onMouseLeave={onMouseLeave} onClick={onClick} ref={buttonRef}>
        {icon && <FontAwesomeIcon icon={icon}/>}
        {emoji && <Twemoji code={emoji}/>}
        {color ?
            <span className="caption" style={{color}}>{caption}</span>
            :
            <span className="caption">{caption}</span>}
    </div>
);

export default PostingButton;
