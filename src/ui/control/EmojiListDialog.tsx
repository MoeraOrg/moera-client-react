import React, { useMemo, useState } from 'react';
import * as immutable from 'object-path-immutable';
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCertificate } from '@fortawesome/free-solid-svg-icons';
import { Trans, useTranslation } from 'react-i18next';

import {
    MAIN_NEGATIVE_REACTIONS,
    MAIN_NEGATIVE_REACTIONS_SET,
    MAIN_POSITIVE_REACTIONS,
    MAIN_POSITIVE_REACTIONS_SET,
    REACTION_EMOJIS
} from "api";
import { Button, EmojiProps, EmojiSelector, ModalDialog, useModalDialog } from "ui/control";
import EmojiList from "util/emoji-list";
import "./EmojiListDialog.css";

const StarMarker = () => <span className="marker"><FontAwesomeIcon icon={faCertificate}/></span>;

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

export function EmojiListDialog({negative, value, advanced, onConfirm, onCancel}: Props) {
    const {t} = useTranslation();

    const allEmojis = useMemo<number[]>(
        () => Object.keys(!negative ? REACTION_EMOJIS.positive : REACTION_EMOJIS.negative)
                .map(emoji => parseInt(emoji)),
        [negative]
    );

    const [choice, setChoice] = useState<Partial<Record<number, Marks>>>(
        () => {
            const list = new EmojiList(value);
            return (
                allEmojis
                    .reduce<Partial<Record<number, Marks>>>(
                        (m, emoji) => {
                            m[emoji] = {
                                dimmed: !list.includesExplicitly(emoji),
                                marked: advanced === true && list.recommends(emoji)
                            };
                            return m;
                        },
                        {}
                    )
            )
        }
    );
    const [other, setOther] = useState<boolean>(() => new EmojiList(value).other());

    const mainEmojis = !negative ? MAIN_POSITIVE_REACTIONS : MAIN_NEGATIVE_REACTIONS;

    const otherEmojis = useMemo<number[]>(
        () => {
            const mainReactionsSet = !negative ? MAIN_POSITIVE_REACTIONS_SET : MAIN_NEGATIVE_REACTIONS_SET;
            return allEmojis.filter(emoji => !mainReactionsSet.has(emoji))
        },
        [negative, allEmojis]
    );

    const mainReactions = useMemo<EmojiProps[]>(
        () => mainEmojis.map(emoji => ({emoji, ...choice[emoji]})),
        [mainEmojis, choice]
    );

    const additionalReactions = useMemo<EmojiProps[]>(
        () => otherEmojis.map(emoji => ({emoji, ...choice[emoji]})),
        [otherEmojis, choice]
    );

    const onOtherClick = () => setOther(!other);

    const switchAll = (dimmed: boolean) => {
        let im = immutable.wrap(choice);
        for (let emoji of mainEmojis) {
            im = im.set([emoji, "dimmed"], dimmed);
        }
        setChoice(im.value);
    }

    const onSelectAll = () => switchAll(false);

    const onUnselectAll = () => switchAll(true);

    const toggle = (marks: Marks): Marks => {
        if (marks == null) {
            return {
                dimmed: true,
                marked: false
            }
        }
        if (advanced) {
            if (marks.marked) {
                return {
                    dimmed: false,
                    marked: false
                }
            }
            if (marks.dimmed) {
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
            dimmed: !marks.dimmed,
            marked: marks.marked
        }
    };

    const onClick = (_: boolean, emoji: number) => {
        const updated = immutable.update(choice, [emoji], toggle);
        setChoice(updated);
    };

    const onConfirmHandler = () => {
        const emojis = allEmojis.filter(emoji => !choice[emoji]?.dimmed);
        let value: string[];
        if (advanced) {
            value = emojis.map(emoji => (choice[emoji]?.marked ? "+0x" : "0x") + Number(emoji).toString(16))
        } else {
            value = emojis.map(emoji => "+0x" + Number(emoji).toString(16));
            if (other) {
                value.push("*");
            }
        }
        onConfirm(value.join(","));
    };

    const {overlayId: parentOverlayId} = useModalDialog();

    return (
        <ModalDialog parentOverlayId={parentOverlayId} onClose={onCancel}>
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
                                        "btn-outline-primary": other,
                                        "btn-outline-secondary": !other
                                    }
                                )}
                                onClick={onOtherClick}>
                            {other ? t("selected-preferred") : t("only-selected-allowed")}
                        </button>
                    </div>
                }
                <h5 className="mt-3">
                    {additionalReactions.length > 0 && "Main"}
                    {advanced ||
                        <div className={cx("btn-group", {"ms-3": additionalReactions.length > 0})}>
                            <button type="button" className="btn btn-sm btn-outline-secondary"
                                    onClick={onSelectAll}>{t("select-all")}</button>
                            <button type="button" className="btn btn-sm btn-outline-secondary"
                                    onClick={onUnselectAll}>{t("unselect-all")}</button>
                        </div>
                    }
                </h5>
                <EmojiSelector negative={negative} reactions={mainReactions} fixedWidth={true} onClick={onClick}
                               autoFocus/>
                {additionalReactions.length > 0 &&
                    <>
                        <h5 className="mt-3">{t("additional")}</h5>
                        <EmojiSelector negative={negative} reactions={additionalReactions} fixedWidth={false}
                                       onClick={onClick}/>
                    </>
                }
            </div>
            <div className="modal-footer">
                <Button variant="secondary" onClick={onCancel}>{t("cancel")}</Button>
                <Button variant="primary" onClick={onConfirmHandler}>{t("ok")}</Button>
            </div>
        </ModalDialog>
    );
}
