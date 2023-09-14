import React from 'react';
import * as immutable from 'object-path-immutable';
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';

import {
    MAIN_NEGATIVE_REACTIONS,
    MAIN_NEGATIVE_REACTIONS_SET,
    MAIN_POSITIVE_REACTIONS,
    MAIN_POSITIVE_REACTIONS_SET,
    REACTION_EMOJIS
} from "api";
import { Button, EmojiProps, EmojiSelector, ModalDialog } from "ui/control";
import EmojiList from "util/emoji-list";
import "./EmojiListDialog.css";

const StarMarker = () => <span className="marker"><FontAwesomeIcon icon="certificate"/></span>;

type Props = {
    negative: boolean;
    value: string;
    advanced?: boolean;
    onConfirm: (emojis: string) => void;
    onCancel: () => void;
} & WithTranslation;

interface Marks {
    dimmed: boolean;
    marked: boolean;
}

interface State {
    choice: Partial<Record<number, Marks>>;
    other: boolean;
}

class EmojiListDialogImpl extends React.PureComponent<Props, State> {

    constructor(props: Props, context: any) {
        super(props, context);

        const list = new EmojiList(props.value);
        const choice = this.getAllEmojis()
            .reduce<Partial<Record<number, Marks>>>(
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
        this.setState(state => immutable.update(state, ["choice", emoji], this.toggle));
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

        const emojis = this.getAllEmojis().filter(emoji => !choice[emoji]?.dimmed);
        let value: string[];
        if (this.props.advanced) {
            value = emojis.map(emoji => (choice[emoji]?.marked ? "+0x" : "0x") + Number(emoji).toString(16))
        } else {
            value = emojis.map(emoji => "+0x" + Number(emoji).toString(16));
            if (other) {
                value.push("*");
            }
        }
        this.props.onConfirm(value.join(","));
    };

    render() {
        const {negative, advanced, onCancel, t} = this.props;

        const additionalReactions = this.getAdditionalReactions();
        return (
            <ModalDialog onClose={onCancel}>
                <div className="emoji-list-dialog modal-body">
                    {advanced ?
                        <div className="help">
                            <Trans i18nKey="only-selected-allowed-star-preferred">
                                <StarMarker/>
                            </Trans>
                        </div>
                    :
                        <div className="text-end">
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
                                {this.state.other ? t("selected-preferred") : t("only-selected-allowed")}
                            </button>
                        </div>
                    }
                    <h5 className="mt-3">
                        {additionalReactions.length > 0 && "Main"}
                        {advanced ||
                            <div className={cx("btn-group", {"ms-3": additionalReactions.length > 0})}>
                                <button type="button" className="btn btn-sm btn-outline-secondary"
                                        onClick={this.onSelectAll}>{t("select-all")}</button>
                                <button type="button" className="btn btn-sm btn-outline-secondary"
                                        onClick={this.onUnselectAll}>{t("unselect-all")}</button>
                            </div>
                        }
                    </h5>
                    <EmojiSelector negative={negative} reactions={this.getMainReactions()} fixedWidth={true}
                                      onClick={this.onClick} autoFocus/>
                    {additionalReactions.length > 0 &&
                        <>
                            <h5 className="mt-3">{t("additional")}</h5>
                            <EmojiSelector negative={negative} reactions={additionalReactions} fixedWidth={false}
                                              onClick={this.onClick}/>
                        </>
                    }
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={onCancel}>{t("cancel")}</Button>
                    <Button variant="primary" onClick={this.onConfirm}>{t("ok")}</Button>
                </div>
            </ModalDialog>
        );
    }

}

// the functional wrapper is needed due to a strange TS error
export const EmojiListDialog = withTranslation()((props: Props) => <EmojiListDialogImpl {...props}/>);
