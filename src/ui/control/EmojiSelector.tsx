import React, { useEffect, useRef } from 'react';

import { EmojiChoice, EmojiOnClick, EmojiProps } from "ui/control/EmojiChoice";
import "./EmojiSelector.css";

interface Props {
    negative: boolean;
    reactions: EmojiProps[];
    fixedWidth?: boolean;
    autoFocus?: boolean;
    onClick: EmojiOnClick;
}

export function EmojiSelector({negative, reactions, fixedWidth, autoFocus, onClick}: Props) {
    const domRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (autoFocus && domRef.current) {
            domRef.current.focus();
        }
    });

    return (
        <div className="emoji-selector" tabIndex={-1} style={{width: fixedWidth ? "15rem" : "auto"}} ref={domRef}>
            {reactions.map(({emoji, invisible, dimmed, marked}) =>
                <EmojiChoice key={emoji} negative={negative} emoji={emoji} invisible={invisible} dimmed={dimmed}
                                marked={marked} onClick={onClick}/>
            )}
        </div>
    );
}
