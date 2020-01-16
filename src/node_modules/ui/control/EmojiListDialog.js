import React from 'react';
import PropType from 'prop-types';
import immutable from 'object-path-immutable';
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    MAIN_NEGATIVE_REACTIONS,
    MAIN_NEGATIVE_REACTIONS_SET,
    MAIN_POSITIVE_REACTIONS,
    MAIN_POSITIVE_REACTIONS_SET,
    REACTION_EMOJIS
} from "api/node/reaction-emojis";
import { Button, ModalDialog, EmojiSelector } from "ui/control";
import EmojiList from "util/emoji-list";
import "./EmojiListDialog.css";

export class EmojiListDialog extends React.PureComponent {

    static propTypes = {
        negative: PropType.bool,
        value: PropType.string,
        advanced: PropType.bool,
        onConfirm: PropType.func,
        onCancel: PropType.func
    };

    constructor(props, context) {
        super(props, context);

        const list = new EmojiList(props.value);
        const choice = this.getAllEmojis()
            .reduce(
                (m, emoji) => {
                    m[emoji] = {
                        dimmed: !list.includesExplicitly(emoji),
                        marked: props.advanced && list.recommends(emoji)
                    };
                    return m;
                },
                {}
            );
        this.state = {choice, other: list.other()};

        this.onOtherClick = this.onOtherClick.bind(this);
        this.onSelectAll = this.onSelectAll.bind(this);
        this.onUnselectAll = this.onUnselectAll.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    getAllEmojis() {
        return Object.keys(!this.props.negative ? REACTION_EMOJIS.positive : REACTION_EMOJIS.negative)
            .map(emoji => parseInt(emoji));
    }

    getMainEmojis() {
        return !this.props.negative ? MAIN_POSITIVE_REACTIONS : MAIN_NEGATIVE_REACTIONS;
    }

    getOtherEmojis() {
        const mainReactionsSet = !this.props.negative ? MAIN_POSITIVE_REACTIONS_SET : MAIN_NEGATIVE_REACTIONS_SET;
        return this.getAllEmojis()
            .filter(emoji => !mainReactionsSet.has(emoji))
    }

    getMainReactions() {
        return this.getMainEmojis().map(emoji => ({emoji, ...this.state.choice[emoji]}));
    }

    getAdditionalReactions() {
        return this.getOtherEmojis().map(emoji => ({emoji, ...this.state.choice[emoji]}));
    }

    onOtherClick() {
        this.setState(state => ({...state, other: !state.other}));
    }

    switchAll(dimmed) {
        this.setState(state => {
            let im = immutable(state);
            for (let emoji of this.getMainEmojis()) {
                im = im.set(["choice", emoji, "dimmed"], dimmed);
            }
            return im.value();
        });
    }

    onSelectAll() {
        this.switchAll(false);
    }

    onUnselectAll() {
        this.switchAll(true);
    }

    onClick(negative, emoji) {
        this.setState(state => immutable.update(state, ["choice", emoji], this.toggle));
    }

    toggle(choice) {
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
            dimmed: !choice.dimmed
        }
    }

    onConfirm() {
        const {choice, other} = this.state;

        let value = this.getAllEmojis().filter(emoji => !choice[emoji].dimmed);
        if (this.props.advanced) {
            value = value.map(emoji => (choice[emoji].marked ? "+0x" : "0x") + Number(emoji).toString(16))
        } else {
            value = value.map(emoji => "+0x" + Number(emoji).toString(16));
            if (other) {
                value.push("*");
            }
        }
        this.props.onConfirm(value.join(","));
    }

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
