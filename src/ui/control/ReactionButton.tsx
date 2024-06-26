import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { createSelector } from 'reselect';

import {
    MAIN_NEGATIVE_REACTIONS,
    MAIN_NEGATIVE_REACTIONS_SET,
    MAIN_POSITIVE_REACTIONS,
    MAIN_POSITIVE_REACTIONS_SET
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
    accepted: string;
    invisible: boolean;
    onReactionAdd: (negative: boolean, emoji: number) => void;
    onReactionDelete: () => void;
}

export function ReactionButton(props: Props) {
    const {emoji, negative, accepted, invisible, onReactionAdd, onReactionDelete} = props;

    const availableList = useSelector((state: ClientState) =>
        !negative ? getAvailableReactionsPositive(state) : getAvailableReactionsNegative(state));

    const pastEmoji = useRef<number | null>(null);
    const [reactions, setReactions] = useState<EmojiProps[]>([]);

    useEffect(() => {
        const acceptedList = new EmojiList(accepted);

        const mainReactions = !negative ? MAIN_POSITIVE_REACTIONS : MAIN_NEGATIVE_REACTIONS;
        const mainReactionsSet = !negative ? MAIN_POSITIVE_REACTIONS_SET : MAIN_NEGATIVE_REACTIONS_SET;
        const main = mainReactions.map(
            r => ({
                emoji: r,
                invisible: (!acceptedList.recommends(r) && !availableList.recommends(r))
                    || !acceptedList.includes(r) || !availableList.includes(r),
                dimmed: !acceptedList.recommends(r)
            } as EmojiProps)
        );
        const additionalNode = acceptedList.recommended()
            .filter(r => !mainReactionsSet.has(r))
            .filter(r => availableList.includes(r))
            .map(r => ({emoji: r} as EmojiProps));
        const additionalClient = availableList.recommended()
            .filter(r => !mainReactionsSet.has(r))
            .filter(r => acceptedList.includes(r) && !acceptedList.recommends(r))
            .map(r => ({emoji: r, dimmed: true} as EmojiProps));
        setReactions(main.concat(additionalNode, additionalClient));
    }, [availableList, accepted, negative]);

    const getDefaultEmoji = (): number | null => {
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

    const defaultReactionAdd = () => {
        const emoji = getDefaultEmoji();
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

    const buttonInvisible = invisible || reactions.every(r => r.invisible);

    const {overlayId: lightBoxOverlayId} = useLightBox();
    const {overlayId: menuOverlayId} = useDropdownMenu();
    const parentOverlayId = menuOverlayId ?? lightBoxOverlayId;

    return (
        <DelayedPopover
            placement="top"
            arrow
            parentOverlayId={parentOverlayId}
            onPreparePopper={preparePopper}
            onShow={show}
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
                reactions={reactions}
                fixedWidth={true}
                onClick={reactionAdd}
            />
        </DelayedPopover>
    );
}

// createSelector() has only one memoized value per selector, so we need two of them

const getAvailableReactionsPositive = createSelector(
    (state: ClientState) => getSetting(state, "reactions.positive.available") as string,
    available => new EmojiList(available)
);

const getAvailableReactionsNegative = createSelector(
    (state: ClientState) => getSetting(state, "reactions.negative.available") as string,
    available => new EmojiList(available)
);
