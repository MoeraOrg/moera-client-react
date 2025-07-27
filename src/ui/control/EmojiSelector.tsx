import React, { useEffect, useRef } from 'react';

import { EmojiChoice, EmojiOnClick, EmojiProps } from "ui/control";
import { ReactionExpandButton } from "ui/control/ReactionExpandButton";
import "./EmojiSelector.css";

interface Props {
    negative: boolean;
    reactions: EmojiProps[];
    fixedWidth?: boolean;
    autoFocus?: boolean;
    onClick: EmojiOnClick;
    expand?: boolean;
    onExpand?: () => void;
}

export function EmojiSelector({negative, reactions, fixedWidth, autoFocus, onClick, expand, onExpand}: Props) {
    const domRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (autoFocus && domRef.current) {
            domRef.current.focus();
        }
    }, [domRef, autoFocus]);

    return (
        <div className="emoji-selector" tabIndex={-1} style={{width: fixedWidth ? "15rem" : "auto"}} ref={domRef}>
            {reactions.map(({emoji, invisible, dimmed}) =>
                <EmojiChoice
                    key={emoji}
                    negative={negative}
                    emoji={emoji}
                    invisible={invisible}
                    dimmed={dimmed}
                    onClick={onClick}
                />
            )}
            {expand != null && onExpand != null &&
                <ReactionExpandButton expanded={expand} onClick={onExpand}/>
            }
        </div>
    );
}
