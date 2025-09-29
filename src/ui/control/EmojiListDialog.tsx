import React, { useMemo, useState } from 'react';
import * as immutable from 'object-path-immutable';
import { useTranslation } from 'react-i18next';

import {
    ADDITIONAL_NEGATIVE_REACTIONS,
    ADDITIONAL_POSITIVE_REACTIONS,
    MAIN_NEGATIVE_REACTIONS,
    MAIN_POSITIVE_REACTIONS,
    REACTION_EMOJIS
} from "api";
import { Button, EmojiProps, EmojiSelector, ModalDialog } from "ui/control";
import { useParent } from "ui/hook";
import EmojiList from "util/emoji-list";
import "./EmojiListDialog.css";

interface Props {
    negative: boolean;
    value: string;
    onConfirm: (emojis: string) => void;
    onCancel: () => void;
}

interface Marks {
    dimmed: boolean;
}

export function EmojiListDialog({negative, value, onConfirm, onCancel}: Props) {
    const {t} = useTranslation();

    const allEmojis = useMemo<number[]>(
        () => Object.keys(!negative ? REACTION_EMOJIS.positive : REACTION_EMOJIS.negative)
                .map(emoji => parseInt(emoji)),
        [negative]
    );

    const [choice, setChoice] = useState<Record<number, Marks>>(
        () => {
            const list = new EmojiList(value);
            return (
                allEmojis
                    .reduce<Record<number, Marks>>(
                        (m, emoji) => {
                            m[emoji] = {dimmed: list.includes(emoji)};
                            return m;
                        },
                        {0: {dimmed: list.other()}}
                    )
            )
        }
    );
    const mainEmojis = !negative ? MAIN_POSITIVE_REACTIONS : MAIN_NEGATIVE_REACTIONS;

    const otherEmojis = (!negative ? ADDITIONAL_POSITIVE_REACTIONS : ADDITIONAL_NEGATIVE_REACTIONS).concat([0]);

    const mainReactions = useMemo<EmojiProps[]>(
        () => mainEmojis.map(emoji => ({emoji, ...choice[emoji]})),
        [mainEmojis, choice]
    );

    const additionalReactions = useMemo<EmojiProps[]>(
        () => otherEmojis.map(emoji => ({emoji, ...choice[emoji]})),
        [otherEmojis, choice]
    );

    const switchAll = (emojis: number[], dimmed: boolean) => {
        let im = immutable.wrap(choice);
        for (let emoji of emojis) {
            im = im.set([emoji, "dimmed"], dimmed);
        }
        setChoice(im.value);
    }

    const onEnableAll = (emojis: number[]) => () => switchAll(emojis, false);

    const onDisableAll = (emojis: number[]) => () => switchAll(emojis, true);

    const toggle = (marks: Marks): Marks => {
        if (marks == null) {
            return {dimmed: true};
        }
        return {dimmed: !marks.dimmed};
    };

    const onClick = (_: boolean, emoji: number) => {
        const updated = immutable.update(choice, [emoji], toggle);
        setChoice(updated);
    };

    const onConfirmHandler = () => {
        const emojis = allEmojis.filter(emoji => emoji !== 0 && choice[emoji]?.dimmed);
        const value = emojis.map(emoji => Number(emoji).toString(16));
        if (choice[0]?.dimmed) {
            value.push("*");
        }
        onConfirm(value.join(" "));
    };

    const {overlayId: parentOverlayId} = useParent();

    return (
        <ModalDialog parentOverlayId={parentOverlayId} onClose={onCancel}>
            <div className="emoji-list-dialog modal-body">
                <div className="help">
                    {t("click-disable-enable")}
                </div>
                <h5 className="mt-3">
                    {t("main")}
                    <div className="btn-group ms-3">
                        <button type="button" className="btn btn-sm btn-outline-secondary"
                                onClick={onEnableAll(mainEmojis)}>{t("enable-all")}</button>
                        <button type="button" className="btn btn-sm btn-outline-secondary"
                                onClick={onDisableAll(mainEmojis)}>{t("disable-all")}</button>
                    </div>
                </h5>
                <EmojiSelector negative={negative} reactions={mainReactions} fixedWidth={true} onClick={onClick}
                               autoFocus/>
                <h5 className="mt-3">
                    {t("additional")}
                    <div className="btn-group ms-3">
                        <button type="button" className="btn btn-sm btn-outline-secondary"
                                onClick={onEnableAll(otherEmojis)}>{t("enable-all")}</button>
                        <button type="button" className="btn btn-sm btn-outline-secondary"
                                onClick={onDisableAll(otherEmojis)}>{t("disable-all")}</button>
                    </div>
                </h5>
                <EmojiSelector negative={negative} reactions={additionalReactions} fixedWidth={false}
                               onClick={onClick}/>
            </div>
            <div className="modal-footer">
                <Button variant="secondary" onClick={onCancel}>{t("cancel")}</Button>
                <Button variant="primary" onClick={onConfirmHandler}>{t("ok")}</Button>
            </div>
        </ModalDialog>
    );
}
