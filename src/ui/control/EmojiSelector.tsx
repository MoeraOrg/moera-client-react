import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { EmojiChoice, EmojiOnClick, EmojiProps, usePopover } from "ui/control";
import { Icon, msExpandCircleDownFilled40, msExpandCircleUpFilled40 } from "ui/material-symbols";
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
    const {update: updatePopover} = usePopover();
    const {t} = useTranslation();

    const domRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (autoFocus && domRef.current) {
            domRef.current.focus();
        }
    }, [domRef, autoFocus]);

    useLayoutEffect(() => {
        if (expand != null) {
            updatePopover();
        }
    }, [expand, updatePopover]);

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
                <>
                    {Array(4 - reactions.length % 5).fill(0).map((_, i) =>
                        <EmojiChoice
                            key={i}
                            negative={negative}
                            emoji={0}
                            invisible
                            onClick={() => {}}
                        />
                    )}
                    <button className="choice expand" onClick={() => onExpand()} title={expand ? t("less") : t("more")}>
                        <Icon icon={expand ? msExpandCircleUpFilled40 : msExpandCircleDownFilled40} size="40"/>
                    </button>
                </>
            }
        </div>
    );
}
