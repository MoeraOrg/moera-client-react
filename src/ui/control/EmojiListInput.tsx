import React, { useState } from 'react';
import cx from 'classnames';

import { NEGATIVE_REACTIONS, POSITIVE_REACTIONS } from "api";
import { EmojiListDialog } from "ui/control";
import { Icon, msEdit } from "ui/material-symbols";
import Twemoji from "ui/twemoji/Twemoji";
import EmojiList from "util/emoji-list";
import "./EmojiListInput.css"

interface Props {
    className?: string;
    negative: boolean;
    value: string;
    disabled?: boolean;
    onChange: (emoji: string) => void;
}

export function EmojiListInput({className, negative, value, disabled, onChange}: Props) {
    const [editing, setEditing] = useState<boolean>(false);

    const edit = () => {
        if (!disabled) {
            setEditing(true);
        }
    };

    const editingConfirmed = (emoji: string) => {
        setEditing(false);
        onChange(emoji);
    };

    const editingCancelled = () => setEditing(false);

    const all = !negative ? POSITIVE_REACTIONS : NEGATIVE_REACTIONS;
    const list = new EmojiList(value);
    return (
        <div className={cx(className, "emoji-list-input")}>
            <div className="content" onClick={edit}>
                {all.filter(e => !list.includes(e)).map(e => <Twemoji key={e} code={e}/>)}
            </div>
            {!disabled &&
                <div className="button" onClick={edit}>
                    <Icon icon={msEdit} size="1.2em"/>
                </div>
            }
            {editing &&
                <EmojiListDialog
                    negative={negative}
                    value={value}
                    onConfirm={editingConfirmed}
                    onCancel={editingCancelled}
                />
            }
        </div>
    );
}
