import React from 'react';

import { REACTION_EMOJIS } from "api";
import { EmojiButton } from "ui/control";

const ReactionEmojiButton = ({icon, emoji, negative, caption, className, invisible, buttonRef, onMouseEnter,
                              onMouseLeave, onReactionAdd, onReactionDelete}) => {
    if (emoji == null) {
        return <EmojiButton icon={["far", icon]} caption={caption} className={className} invisible={invisible}
                            buttonRef={buttonRef} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
                            onClick={onReactionAdd}/>;
    } else {
        const re = !negative ? REACTION_EMOJIS.positive[emoji] : REACTION_EMOJIS.negative[emoji];
        return <EmojiButton emoji={emoji} caption={re ? re.title : caption} color={re ? re.color : null}
                            className={className} buttonRef={buttonRef} onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave} onClick={onReactionDelete}/>;
    }
}

export { ReactionEmojiButton };
