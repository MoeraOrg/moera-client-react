import React, { ForwardedRef, forwardRef, MouseEventHandler } from 'react';
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
    onReactionAdd: MouseEventHandler<HTMLButtonElement>;
    onReactionDelete: MouseEventHandler<HTMLButtonElement>;
}

function ReactionEmojiButtonImpl(
    {icon, emoji, negative, caption, className, invisible, onReactionAdd, onReactionDelete}: Props,
    ref: ForwardedRef<HTMLButtonElement>
) {
    const {t} = useTranslation();

    if (emoji == null) {
        return <EmojiButton icon={icon ? ["far", icon] : null} caption={caption} className={className}
                            invisible={invisible} ref={ref} onClick={onReactionAdd}/>;
    } else {
        const re = !negative ? REACTION_EMOJIS.positive[emoji] : REACTION_EMOJIS.negative[emoji];
        return <EmojiButton emoji={emoji} caption={re ? t(re.title) : caption} color={re ? re.color : null}
                            className={className} ref={ref} onClick={onReactionDelete}/>;
    }
}

const ReactionEmojiButton = forwardRef(ReactionEmojiButtonImpl);

export { ReactionEmojiButton };
