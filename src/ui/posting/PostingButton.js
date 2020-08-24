import React from 'react';

import { EmojiButton } from "ui/control";
import "./PostingButton.css";

const PostingButton = ({icon, emoji, caption, color, invisible, buttonRef, onMouseEnter, onMouseLeave, onClick}) => (
    <EmojiButton icon={icon} emoji={emoji} caption={caption} color={color} className="posting-button"
                 invisible={invisible} buttonRef={buttonRef} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
                 onClick={onClick}/>
);

export default PostingButton;
