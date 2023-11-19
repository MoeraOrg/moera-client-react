import React from 'react';
import { useSelector } from 'react-redux';
import { format, formatDistanceToNow, formatISO, fromUnixTime } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { getDateFnsLocale } from "i18n";
import { ClientState } from "state/state";

interface Props {
    createdAt: number;
    editedAt: number | null | undefined;
}

export default function CommentUpdated({createdAt, editedAt}: Props) {
    useSelector((state: ClientState) => state.pulse.pulse); // To force re-rendering only
    const {t} = useTranslation();

    editedAt = editedAt ?? createdAt;
    const editedImmediately = Math.abs(editedAt - createdAt) < 20 * 60;

    if (editedImmediately) {
        return null;
    }

    const date = fromUnixTime(editedAt);
    return (
        <time className="date" dateTime={formatISO(date)}>{" "}
            ({t("comment-updated-at")}{" "}
            <abbr title={format(date, "dd-MM-yyyy HH:mm")}>
                {formatDistanceToNow(date, {locale: getDateFnsLocale()})}
            </abbr>)
        </time>
    );
}
