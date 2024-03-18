import React from 'react';
import { useSelector } from 'react-redux';
import { format, formatDistanceToNow, formatISO, fromUnixTime } from 'date-fns';

import { PostingInfo } from "api";
import { getDateFnsLocale } from "i18n";
import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import Jump from "ui/navigation/Jump";
import { REL_CURRENT } from "util/rel-node-name";
import "./PostingDate.css"

interface Props {
    posting: PostingInfo;
    publishedAt: number;
}

export default function PostingDate({posting, publishedAt}: Props) {
    const timeRelative = useSelector((state: ClientState) => getSetting(state, "posting.time.relative") as boolean);
    useSelector((state: ClientState) =>
        getSetting(state, "posting.time.relative") ? state.pulse.pulse : null); // To force re-rendering only

    const unixTime = posting.receiverName ? (posting.receiverCreatedAt ?? posting.createdAt) : publishedAt;
    const date = fromUnixTime(unixTime);
    const originalDeleted = posting.receiverDeletedAt != null;
    const nodeName = originalDeleted ? REL_CURRENT : (posting.receiverName ?? posting.ownerName);
    const postingId = originalDeleted ? posting.id : (posting.receiverPostingId ?? posting.id);
    return (
        <Jump className="date" nodeName={nodeName} href={`/post/${postingId}`}>{
            timeRelative ?
                <time dateTime={formatISO(date)} title={format(date, "dd-MM-yyyy HH:mm")}>
                    {formatDistanceToNow(date, {locale: getDateFnsLocale()})}
                </time>
            :
                <time dateTime={formatISO(date)} title={formatDistanceToNow(date, {locale: getDateFnsLocale()})}>
                    {format(date, "dd-MM-yyyy HH:mm")}
                </time>
        }</Jump>
    );
}
