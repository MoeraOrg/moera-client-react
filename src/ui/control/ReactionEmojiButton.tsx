import React, { MouseEventHandler, TouchEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { IconName } from '@fortawesome/free-regular-svg-icons';

import { REACTION_EMOJIS } from "api";
import { EmojiButton } from "ui/control";

interface Props {
    icon?: IconName;
    emoji?: number | null;
    negative?: boolean;
    caption?: string;
    className?: string;
    invisible?: boolean;
    buttonRef?: React.Ref<HTMLButtonElement>;
    onMouseEnter?: MouseEventHandler<HTMLButtonElement>;
    onMouseLeave?: MouseEventHandler<HTMLButtonElement>;
    onTouchStart?: TouchEventHandler<HTMLButtonElement>;
    onReactionAdd: MouseEventHandler<HTMLButtonElement>;
    onReactionDelete: MouseEventHandler<HTMLButtonElement>;
}

const ReactionEmojiButton = ({
    icon, emoji, negative, caption, className, invisible, buttonRef, onMouseEnter, onMouseLeave, onTouchStart,
    onReactionAdd, onReactionDelete
}: Props) => {
    const {t} = useTranslation();

    if (emoji == null) {
        return <EmojiButton icon={icon ? ["far", icon] : null} caption={caption} className={className}
                            invisible={invisible} buttonRef={buttonRef} onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave} onTouchStart={onTouchStart} onClick={onReactionAdd}/>;
    } else {
        const re = !negative ? REACTION_EMOJIS.positive[emoji] : REACTION_EMOJIS.negative[emoji];
        return <EmojiButton emoji={emoji} caption={re ? t(re.title) : caption} color={re ? re.color : null}
                            className={className} buttonRef={buttonRef} onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave} onTouchStart={onTouchStart} onClick={onReactionDelete}/>;
    }
}

export { ReactionEmojiButton };
