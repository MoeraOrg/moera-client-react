import React, { useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { createSelector } from 'reselect';

import {
    ADDITIONAL_NEGATIVE_REACTIONS,
    ADDITIONAL_POSITIVE_REACTIONS,
    MAIN_NEGATIVE_REACTIONS,
    MAIN_POSITIVE_REACTIONS
} from "api";
import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import { DelayedPopover, EmojiProps, EmojiSelector, ReactionEmojiButton, useDropdownMenu } from "ui/control";
import { useLightBox } from "ui/lightbox/lightbox-context";
import EmojiList from "util/emoji-list";

interface Props {
    icon: IconProp,
    emoji: number | null;
    caption?: string;
    className?: string;
    negative: boolean;
    rejected?: string | null;
    invisible: boolean;
    onReactionAdd: (negative: boolean, emoji: number) => void;
    onReactionDelete: () => void;
}

export function ReactionButton(props: Props) {
    const {emoji, negative, rejected, invisible, onReactionAdd, onReactionDelete} = props;

    const pastEmoji = useRef<number | null>(null);

    const [expanded, setExpanded] = useState<boolean>(false);
    const onExpandClick = () => setExpanded(!expanded);

    const disabledList = useSelector((state: ClientState) =>
        !negative ? getDisabledReactionsPositive(state) : getDisabledReactionsNegative(state)
    );
    const rejectedSet = useMemo(() => new EmojiList(rejected).included(), [rejected]);
    const mainReactions = useMemo<EmojiProps[]>(
        () => toReactionList(!negative ? MAIN_POSITIVE_REACTIONS : MAIN_NEGATIVE_REACTIONS, disabledList, rejectedSet),
        [disabledList, negative, rejectedSet]
    );
    const additionalReactions = useMemo<EmojiProps[]>(
        () => toReactionList(
            !negative ? ADDITIONAL_POSITIVE_REACTIONS : ADDITIONAL_NEGATIVE_REACTIONS, disabledList, rejectedSet
        ),
        [disabledList, negative, rejectedSet]
    );

    const expandAll = useSelector((state: ClientState) => getSetting(state, "reactions.expand-all") as boolean);
    const expandAlways = expandAll || mainReactions.length === 0 || additionalReactions.length === 0;

    const defaultReactionAdd = () => {
        const emoji = getDefaultEmoji(negative, mainReactions) ?? getDefaultEmoji(negative, additionalReactions);
        if (emoji != null) {
            onReactionAdd(negative, emoji);
        }
    }

    const reactionAdd = (negative: boolean, emoji: number) => onReactionAdd(negative, emoji);

    const reactionDelete = () => onReactionDelete();

    const preparePopper = () => {
        pastEmoji.current = emoji;
    }

    const show = (): boolean => pastEmoji.current === emoji;

    const hide = () => setExpanded(false);

    const buttonInvisible = invisible
        || (mainReactions.every(r => r.invisible) && additionalReactions.every(r => r.invisible));

    const {overlayId: lightBoxOverlayId} = useLightBox();
    const {overlayId: menuOverlayId} = useDropdownMenu();
    const parentOverlayId = menuOverlayId ?? lightBoxOverlayId;

    return (
        <DelayedPopover
            placement="top"
            arrow
            parentOverlayId={parentOverlayId}
            clickable
            onPreparePopper={preparePopper}
            onShow={show}
            onHide={hide}
            element={ref =>
                <ReactionEmojiButton
                    {...props}
                    invisible={buttonInvisible}
                    ref={ref}
                    onReactionAdd={defaultReactionAdd}
                    onReactionDelete={reactionDelete}
                />
            }
        >
            <EmojiSelector
                negative={negative}
                reactions={mainReactions}
                fixedWidth={true}
                onClick={reactionAdd}
                expand={expandAlways ? undefined : expanded}
                onExpand={onExpandClick}
            />
            {(expandAlways || expanded) &&
                <EmojiSelector
                    negative={negative}
                    reactions={additionalReactions}
                    fixedWidth={true}
                    onClick={reactionAdd}
                />
            }
        </DelayedPopover>
    );
}

// createSelector() has only one memoized value per selector, so we need two of them

const getDisabledReactionsPositive = createSelector(
    (state: ClientState) => getSetting(state, "reactions.positive.disabled") as string,
    available => new EmojiList(available)
);

const getDisabledReactionsNegative = createSelector(
    (state: ClientState) => getSetting(state, "reactions.negative.disabled") as string,
    available => new EmojiList(available)
);

function getDefaultEmoji(negative: boolean, reactions: EmojiProps[]): number | null {
    const thumbsEmoji = negative ? 0x1f44e : 0x1f44d;
    const thumbs = reactions.find(r => r.emoji === thumbsEmoji);

    if (thumbs && !thumbs.invisible && !thumbs.dimmed) {
        return thumbsEmoji;
    }
    const first = reactions.find(r => !r.invisible && !r.dimmed);
    if (first) {
        return first.emoji;
    }

    if (thumbs && !thumbs.invisible) {
        return thumbsEmoji;
    }
    const second = reactions.find(r => !r.invisible);
    return second ? second.emoji : null;
}

function toReactionList(reactions: number[], disabled: EmojiList, rejected: Set<number>) {
    const list = reactions
        .filter(emoji => !disabled.includes(emoji))
        .map(emoji => ({emoji, invisible: rejected.has(emoji)} as EmojiProps));
    if (list.length === 0 || list.every(r => r.invisible)) {
        return [];
    }

    let start: number | null = null;
    let i = 0;
    while (i < list.length) {
        if (start != null && i - start === 5) {
            list.splice(start, 5);
            i -= 5;
            start = null;
        }
        if (list[i].invisible) {
            start = start ?? i;
        } else {
            start = null;
        }
        i++;
    }
    if (start != null && list.length - start === 5) {
        list.splice(start, 5);
    }

    return list;
}
