import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { format, formatISO, fromUnixTime } from 'date-fns';

import { tDistanceToNow } from "i18n/time";
import { ClientState } from "state/state";
import Jump from "ui/navigation/Jump";
import { RelNodeName } from "util/rel-node-name";
import { ut } from "util/url";
import "./CommentDate.css"

interface Props {
    nodeName?: RelNodeName | string;
    postingId: string;
    commentId: string;
    createdAt: number;
}

export default function CommentDate({nodeName, postingId, commentId, createdAt}: Props) {
    useSelector((state: ClientState) => state.pulse.pulse); // To force re-rendering only
    const {t} = useTranslation();

    const date = fromUnixTime(createdAt);
    return (
        <Jump nodeName={nodeName} href={ut`/post/${postingId}?comment=${commentId}`} className="date">
            <time dateTime={formatISO(date)} title={format(date, "dd-MM-yyyy HH:mm")}>
                {tDistanceToNow(date, t)}
            </time>
        </Jump>
    );
}
