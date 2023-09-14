import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { format, formatDistanceToNow, formatISO, fromUnixTime } from 'date-fns';

import { CommentInfo } from "api";
import { getDateFnsLocale } from "i18n";
import { ClientState } from "state/state";
import Jump from "ui/navigation/Jump";
import "./CommentDate.css"

type Props = {
    nodeName?: string | null;
    postingId: string;
    comment: CommentInfo;
} & ConnectedProps<typeof connector>;

function CommentDate({nodeName, postingId, comment}: Props) {
    const date = fromUnixTime(comment.createdAt);
    return (
        <Jump nodeName={nodeName} href={`/post/${postingId}?comment=${comment.id}`} className="date">
            <time dateTime={formatISO(date)} title={format(date, "dd-MM-yyyy HH:mm")}>
                {formatDistanceToNow(date, {locale: getDateFnsLocale()})}
            </time>
        </Jump>
    );
}

const connector = connect(
    (state: ClientState) => ({
        pulse: state.pulse.pulse // To force re-rendering only
    })
);

export default connector(CommentDate);
