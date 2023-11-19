import React from 'react';
import { useSelector } from 'react-redux';
import { format, formatDistanceToNow, formatISO, fromUnixTime } from 'date-fns';

import { getDateFnsLocale } from "i18n";
import { ClientState } from "state/state";
import Jump from "ui/navigation/Jump";
import "./CommentDate.css"

interface Props {
    nodeName?: string | null;
    postingId: string;
    commentId: string;
    createdAt: number;
}

export default function CommentDate({nodeName, postingId, commentId, createdAt}: Props) {
    useSelector((state: ClientState) => state.pulse.pulse); // To force re-rendering only

    const date = fromUnixTime(createdAt);
    return (
        <Jump nodeName={nodeName} href={`/post/${postingId}?comment=${commentId}`} className="date">
            <time dateTime={formatISO(date)} title={format(date, "dd-MM-yyyy HH:mm")}>
                {formatDistanceToNow(date, {locale: getDateFnsLocale()})}
            </time>
        </Jump>
    );
}
