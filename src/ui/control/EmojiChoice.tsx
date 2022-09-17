import React from 'react';
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { REACTION_EMOJIS } from "api";
import Twemoji from "ui/twemoji/Twemoji";
import "./EmojiChoice.css";

export interface EmojiProps {
    emoji: number;
    invisible?: boolean;
    dimmed?: boolean;
    marked?: boolean;
}

export type EmojiOnClick = (negative: boolean, emoji: number) => void;

interface Props extends EmojiProps {
    negative: boolean;
    onClick: EmojiOnClick;
}

export function EmojiChoice({negative, emoji, invisible, dimmed, marked, onClick}: Props) {
    const re = !negative ? REACTION_EMOJIS.positive[emoji] : REACTION_EMOJIS.negative[emoji];
    const {t} = useTranslation();

    return (
        <div className={cx("choice", {invisible, dimmed})} onClick={() => onClick(negative, emoji)}>
            <Twemoji key={emoji} code={emoji} title={re ? t(re.title) : ""}/>
            {marked && <div className="marker"><FontAwesomeIcon icon="certificate"/></div>}
        </div>
    );
}
