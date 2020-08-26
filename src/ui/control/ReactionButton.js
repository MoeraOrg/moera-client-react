import React from 'react';
import PropType from 'prop-types';
import * as ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Manager, Popper, Reference } from 'react-popper';
import cx from 'classnames';
import debounce from 'lodash.debounce';

import { EmojiSelector, ReactionEmojiButton } from "ui/control";
import { getSetting } from "state/settings/selectors";
import {
    MAIN_NEGATIVE_REACTIONS,
    MAIN_NEGATIVE_REACTIONS_SET,
    MAIN_POSITIVE_REACTIONS,
    MAIN_POSITIVE_REACTIONS_SET
} from "api/node/reaction-emojis";
import EmojiList from "util/emoji-list";

class ReactionButtonImpl extends React.PureComponent {

    static propTypes = {
        icon: PropType.oneOfType([PropType.arrayOf(PropType.string), PropType.string]),
        emoji: PropType.number,
        caption: PropType.string,
        className: PropType.string,
        negative: PropType.bool,
        available: PropType.instanceOf(EmojiList),
        accepted: PropType.string,
        invisible: PropType.bool,
        onReactionAdd: PropType.func,
        onReactionDelete: PropType.func
    };

    state = {
        locus: "out",
        popup: false,
        reactions: []
    };

    componentDidMount() {
        this.updateReactions();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.available !== prevProps.available) {
            this.updateReactions();
        }
    }

    updateReactions() {
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
            })
        );
        const additionalNode = accepted.recommended()
            .filter(r => !mainReactionsSet.has(r))
            .filter(r => available.includes(r))
            .map(r => ({emoji: r}));
        const additionalClient = available.recommended()
            .filter(r => !mainReactionsSet.has(r))
            .filter(r => accepted.includes(r) && !accepted.recommends(r))
            .map(r => ({emoji: r, dimmed: true}));
        this.setState({reactions: main.concat(additionalNode, additionalClient)});
    }

    isInvisible() {
        return this.props.invisible || this.state.reactions.every(r => r.invisible);
    }

    getDefaultEmoji() {
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

    documentClick = () => {
        this.hide();
    };

    mainEnter = () => {
        this.setLocus("main");
    };

    mainLeave = () => {
        if (this.state.locus === "main") {
            this.setLocus("out");
        }
    };

    popupEnter = () => {
        this.setLocus("popup");
    };

    popupLeave = () => {
        if (this.state.locus === "popup") {
            this.setLocus("out");
        }
    };

    setLocus(locus) {
        const changed = this.state.locus !== locus;
        this.setState({locus});
        if (changed) {
            this.onTimeout();
        }
    }

    onTimeout = debounce(() => {
        switch (this.state.locus) {
            case "out":
                this.hide();
                break;
            case "main":
                this.show();
                break;
            default:
                // do nothing
        }
    }, 1000);

    show() {
        this.setState({popup: true});
        document.addEventListener("click", this.documentClick);
    }

    hide() {
        this.setState({popup: false});
        document.removeEventListener("click", this.documentClick);
    }

    defaultReactionAdd = () => {
        const {negative, onReactionAdd} = this.props;

        onReactionAdd(negative, this.getDefaultEmoji());
    }

    reactionAdd = (negative, emoji) => {
        this.props.onReactionAdd(negative, emoji);
    }

    reactionDelete = () => {
        this.props.onReactionDelete();
    }

    render() {
        const {negative} = this.props;
        return (
            <Manager>
                <Reference>
                    {({ref}) =>
                        <ReactionEmojiButton
                            {...this.props}
                            invisible={this.isInvisible()}
                            buttonRef={ref}
                            onMouseEnter={this.mainEnter}
                            onMouseLeave={this.mainLeave}
                            onReactionAdd={this.defaultReactionAdd}
                            onReactionDelete={this.reactionDelete}
                        />
                    }
                </Reference>
                {ReactDOM.createPortal(
                    (this.state.popup || this.state.locus !== "out") &&
                        <Popper placement="top">
                            {({ref, style, placement}) => (
                                <div ref={ref} style={style} className={cx(
                                    "popover",
                                    `bs-popover-${placement}`,
                                    "shadow",
                                    "fade",
                                    {"show": this.state.popup}
                                )}>
                                    <div className="popover-body" onMouseEnter={this.popupEnter}
                                         onMouseLeave={this.popupLeave}>
                                        <EmojiSelector
                                            negative={negative}
                                            reactions={this.state.reactions}
                                            fixedWidth={true}
                                            onClick={this.reactionAdd}
                                        />
                                    </div>
                                </div>
                            )}
                        </Popper>,
                    document.querySelector("#modal-root")
                )}
            </Manager>
        );
    }

}

export const ReactionButton = connect(
    (state, ownProps) => ({
        available: new EmojiList(getSetting(state,
            !ownProps.negative ? "reactions.positive.available" : "reactions.negative.available"))
    }),
)(ReactionButtonImpl);
