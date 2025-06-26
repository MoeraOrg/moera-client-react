import React from 'react';
import { useSelector } from 'react-redux';
import { format, formatISO, fromUnixTime } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { tDistanceToNow } from "i18n/time";
import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";

interface Props {
    createdAt: number;
    editedAt: number | null | undefined;
    publishedAt: number;
}

export default function PostingUpdated({createdAt, editedAt, publishedAt}: Props) {
    const timeRelative = useSelector((state: ClientState) => getSetting(state, "posting.time.relative") as boolean);
    useSelector((state: ClientState) =>
        getSetting(state, "posting.time.relative") ? state.pulse.pulse : null); // To force re-rendering only
    const {t} = useTranslation();

    const updatedAt = editedAt ?? createdAt;
    const updatedImmediately = Math.abs(updatedAt - publishedAt) < 20 * 60;

    if (updatedImmediately) {
        return null;
    }

    const date = fromUnixTime(updatedAt);
    const editedSoon = Math.abs(updatedAt - publishedAt) < 24 * 60 * 60;

    return (
        <time className="date" dateTime={formatISO(date)}>
            {" "}({t("posting-updated-at")} {
                timeRelative ?
                    <abbr title={format(date, "dd-MM-yyyy HH:mm")}>
                        {tDistanceToNow(date, t)}
                    </abbr>
                :
                    (editedSoon ? format(date, "HH:mm") : format(date, "dd-MM-yyyy HH:mm"))
            })
        </time>
    );
}
