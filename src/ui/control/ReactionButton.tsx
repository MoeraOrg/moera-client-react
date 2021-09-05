import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IconName } from '@fortawesome/free-regular-svg-icons';

import { ClientState } from "state/state";
import { EmojiProps } from "ui/control/EmojiChoice";
import { DelayedPopper, Manager, Reference } from "ui/control/DelayedPopper";
import { EmojiSelector, ReactionEmojiButton } from "ui/control/index";
import { getSetting } from "state/settings/selectors";
import {
    MAIN_NEGATIVE_REACTIONS,
    MAIN_NEGATIVE_REACTIONS_SET,
    MAIN_POSITIVE_REACTIONS,
    MAIN_POSITIVE_REACTIONS_SET
} from "api/node/reaction-emojis";
import EmojiList from "util/emoji-list";
import { createSelector } from "reselect";

interface OwnProps {
    icon: IconName,
    emoji: number | null;
    caption: string;
    className?: string;
    negative: boolean;
    accepted: string;
    invisible: boolean;
    onReactionAdd: (negative: boolean, emoji: number) => void;
    onReactionDelete: () => void;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

interface State {
    reactions: EmojiProps[];
}

class ReactionButtonImpl extends React.PureComponent<Props, State> {

    #pastEmoji: number | null = null;

    constructor(props: Props, context: any) {
        super(props, context);

        this.state = {
            reactions: []
        };
    }

    componentDidMount() {
        this.updateReactions();
    }

    componentDidUpdate(prevProps: Readonly<Props>) {
        if (this.props.available !== prevProps.available) {
            this.updateReactions();
        }
    }

    updateReactions(): void {
        const {negative, available} = this.props;
        const accepted = new EmojiList(this.props.accepted);

        const mainReactions = !negative ? MAIN_POSITIVE_REACTIONS : MAIN_NEGATIVE_REACTIONS;
        const mainReactionsSet = !negative ? MAIN_POSITIVE_REACTIONS_SET : MAIN_NEGATIVE_REACTIONS_SET;
        const main = mainReactions.map(
            r => ({
                emoji: r,
                invisible: (!accepted.recommends(r) && !available.recommends(r))
                    || !accepted.includes(r) || !available.includes(r),
                dimmed: !accepted.recommends(r)
            } as EmojiProps)
        );
        const additionalNode = accepted.recommended()
            .filter(r => !mainReactionsSet.has(r))
            .filter(r => available.includes(r))
            .map(r => ({emoji: r} as EmojiProps));
        const additionalClient = available.recommended()
            .filter(r => !mainReactionsSet.has(r))
            .filter(r => accepted.includes(r) && !accepted.recommends(r))
            .map(r => ({emoji: r, dimmed: true} as EmojiProps));
        this.setState({reactions: main.concat(additionalNode, additionalClient)});
    }

    isInvisible(): boolean {
        return this.props.invisible || this.state.reactions.every(r => r.invisible);
    }

    getDefaultEmoji(): number | null {
        const {negative} = this.props;
        const {reactions} = this.state;

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

    defaultReactionAdd = () => {
        const {negative, onReactionAdd} = this.props;

        const emoji = this.getDefaultEmoji();
        if (emoji != null) {
            onReactionAdd(negative, emoji);
        }
    }

    reactionAdd = (negative: boolean, emoji: number) => {
        this.props.onReactionAdd(negative, emoji);
    }

    reactionDelete = () => {
        this.props.onReactionDelete();
    }

    preparePopper = () => {
        this.#pastEmoji = this.props.emoji;
    }

    show = () => {
        return this.#pastEmoji === this.props.emoji;
    }

    render() {
        const {negative} = this.props;

        return (
            <Manager onPreparePopper={this.preparePopper} onShow={this.show}>
                <Reference>
                    {(ref, mainEnter, mainLeave, mainTouch) =>
                        <ReactionEmojiButton
                            {...this.props}
                            invisible={this.isInvisible()}
                            buttonRef={ref}
                            onMouseEnter={mainEnter}
                            onMouseLeave={mainLeave}
                            onTouchStart={mainTouch}
                            onReactionAdd={this.defaultReactionAdd}
                            onReactionDelete={this.reactionDelete}
                        />
                    }
                </Reference>
                <DelayedPopper placement="top" arrow={true}>
                    <EmojiSelector
                        negative={negative}
                        reactions={this.state.reactions}
                        fixedWidth={true}
                        onClick={this.reactionAdd}
                    />
                </DelayedPopper>
            </Manager>
        );
    }

}

const getAvailableReactions = createSelector(
    (state: ClientState, ownProps: OwnProps) => getSetting(state,
        !ownProps.negative ? "reactions.positive.available" : "reactions.negative.available") as string,
    available => new EmojiList(available)
);

const connector = connect(
    (state: ClientState, ownProps: OwnProps) => ({
        available: getAvailableReactions(state, ownProps)
    }),
);

export const ReactionButton = connector(ReactionButtonImpl);
