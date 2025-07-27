import React from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { REACTION_EMOJIS } from "api";
import { usePopover } from "ui/control/popover-context";
import Twemoji from "ui/twemoji/Twemoji";
import "./EmojiChoice.css";

export interface EmojiProps {
    emoji: number;
    invisible?: boolean;
    dimmed?: boolean;
}

export type EmojiOnClick = (negative: boolean, emoji: number) => void;

interface Props extends EmojiProps {
    negative: boolean;
    onClick: EmojiOnClick;
}

export function EmojiChoice({negative, emoji, invisible, dimmed, onClick}: Props) {
    const {hide} = usePopover();

    const re = !negative ? REACTION_EMOJIS.positive[emoji] : REACTION_EMOJIS.negative[emoji];
    const {t} = useTranslation();

    const onEmojiClick = (negative: boolean, emoji: number) => {
        hide();
        onClick(negative, emoji);
    }

    return (
        <button className={cx("choice", {invisible, dimmed})} onClick={() => onEmojiClick(negative, emoji)}>
            <Twemoji key={emoji} code={emoji} title={re ? t(re.title) : ""}/>
        </button>
    );
}
