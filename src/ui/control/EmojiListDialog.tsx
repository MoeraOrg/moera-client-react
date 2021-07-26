import React from 'react';
import * as immutable from 'object-path-immutable';
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    MAIN_NEGATIVE_REACTIONS,
    MAIN_NEGATIVE_REACTIONS_SET,
    MAIN_POSITIVE_REACTIONS,
    MAIN_POSITIVE_REACTIONS_SET,
    REACTION_EMOJIS
} from "api/node/reaction-emojis";
import { Button, EmojiSelector, ModalDialog } from "ui/control/index";
import { EmojiProps } from "ui/control/EmojiChoice";
import EmojiList from "util/emoji-list";
import "./EmojiListDialog.css";

interface Props {
    negative: boolean;
    value: string;
    advanced?: boolean;
    onConfirm: (emojis: string) => void;
    onCancel: () => void;
}

interface Marks {
    dimmed: boolean;
    marked: boolean;
}

interface State {
    choice: Record<number, Marks>;
    other: boolean;
}

export class EmojiListDialog extends React.PureComponent<Props, State> {

    constructor(props: Props, context: any) {
        super(props, context);

        const list = new EmojiList(props.value);
        const choice = this.getAllEmojis()
            .reduce<Record<number, Marks>>(
                (m, emoji) => {
                    m[emoji] = {
                        dimmed: !list.includesExplicitly(emoji),
                        marked: props.advanced === true && list.recommends(emoji)
                    };
                    return m;
                },
                {}
            );
        this.state = {choice, other: list.other()};
    }

    getAllEmojis(): number[] {
        return Object.keys(!this.props.negative ? REACTION_EMOJIS.positive : REACTION_EMOJIS.negative)
            .map(emoji => parseInt(emoji));
    }

    getMainEmojis(): number[] {
        return !this.props.negative ? MAIN_POSITIVE_REACTIONS : MAIN_NEGATIVE_REACTIONS;
    }

    getOtherEmojis(): number[] {
        const mainReactionsSet = !this.props.negative ? MAIN_POSITIVE_REACTIONS_SET : MAIN_NEGATIVE_REACTIONS_SET;
        return this.getAllEmojis()
            .filter(emoji => !mainReactionsSet.has(emoji))
    }

    getMainReactions(): EmojiProps[] {
        return this.getMainEmojis().map(emoji => ({emoji, ...this.state.choice[emoji]}));
    }

    getAdditionalReactions(): EmojiProps[] {
        return this.getOtherEmojis().map(emoji => ({emoji, ...this.state.choice[emoji]}));
    }

    onOtherClick = () => {
        this.setState(state => ({...state, other: !state.other}));
    };

    switchAll(dimmed: boolean): void {
        this.setState(state => {
            let im = immutable.wrap(state);
            for (let emoji of this.getMainEmojis()) {
                im = im.set(["choice", emoji, "dimmed"], dimmed);
            }
            return im.value();
        });
    }

    onSelectAll = () => {
        this.switchAll(false);
    };

    onUnselectAll = () => {
        this.switchAll(true);
    };

    onClick = (negative: boolean, emoji: number) => {
        this.setState(state => immutable.update(state, ["choice", emoji], this.toggle) as any);
    };

    toggle = (choice: Marks): Marks => {
        if (choice == null) {
            return {
                dimmed: true,
                marked: false
            }
        }
        if (this.props.advanced) {
            if (choice.marked) {
                return {
                    dimmed: false,
                    marked: false
                }
            }
            if (choice.dimmed) {
                return {
                    dimmed: false,
                    marked: true
                }
            }
            return {
                dimmed: true,
                marked: false
            }
        }
        return {
            dimmed: !choice.dimmed,
            marked: choice.marked
        }
    };

    onConfirm = () => {
        const {choice, other} = this.state;

        const emojis = this.getAllEmojis().filter(emoji => !choice[emoji].dimmed);
        let value: string[];
        if (this.props.advanced) {
            value = emojis.map(emoji => (choice[emoji].marked ? "+0x" : "0x") + Number(emoji).toString(16))
        } else {
            value = emojis.map(emoji => "+0x" + Number(emoji).toString(16));
            if (other) {
                value.push("*");
            }
        }
        this.props.onConfirm(value.join(","));
    };

    render() {
        const {negative, advanced, onCancel} = this.props;

        const additionalReactions = this.getAdditionalReactions();
        return (
            <ModalDialog onClose={onCancel}>
                <div className="emoji-list-dialog modal-body">
                    {advanced ?
                        <div className="help">
                            Only selected are allowed, marked by{" "}
                            <span className="marker"><FontAwesomeIcon icon="certificate"/></span>
                            {" "}are preferred
                        </div>
                    :
                        <div className="text-right">
                            <button type="button"
                                    className={cx(
                                        "btn",
                                        "btn-sm",
                                        {
                                            "btn-outline-primary": this.state.other,
                                            "btn-outline-secondary": !this.state.other
                                        }
                                    )}
                                    onClick={this.onOtherClick}>
                                {this.state.other ? "Selected are preferred" : "Only selected are allowed"}
                            </button>
                        </div>
                    }
                    <h5 className="mt-3">
                        {additionalReactions.length > 0 && "Main"}
                        {advanced ||
                            <div className="btn-group ml-3">
                                <button type="button" className="btn btn-sm btn-outline-secondary"
                                        onClick={this.onSelectAll}>Select all</button>
                                <button type="button" className="btn btn-sm btn-outline-secondary"
                                        onClick={this.onUnselectAll}>Unselect all</button>
                            </div>
                        }
                    </h5>
                    <EmojiSelector negative={negative} reactions={this.getMainReactions()} fixedWidth={true}
                                      onClick={this.onClick} autoFocus/>
                    {additionalReactions.length > 0 &&
                        <>
                            <h5 className="mt-3">Additional</h5>
                            <EmojiSelector negative={negative} reactions={additionalReactions} fixedWidth={false}
                                              onClick={this.onClick}/>
                        </>
                    }
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                    <Button variant="primary" onClick={this.onConfirm}>OK</Button>
                </div>
            </ModalDialog>
        );
    }

}
