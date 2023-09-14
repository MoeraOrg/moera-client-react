import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { format, formatDistanceToNow, formatISO, fromUnixTime } from 'date-fns';

import { PostingInfo } from "api";
import { getDateFnsLocale } from "i18n";
import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import Jump from "ui/navigation/Jump";
import { MinimalStoryInfo } from "ui/types";
import "./PostingDate.css"

type Props = {
    posting: PostingInfo;
    story: MinimalStoryInfo | null;
} & ConnectedProps<typeof connector>;

function PostingDate({posting, story, timeRelative}: Props) {
    let publishedAt;
    if (posting.receiverName) {
        publishedAt = posting.receiverCreatedAt ?? posting.createdAt;
    } else {
        publishedAt = story != null ? story.publishedAt : posting.createdAt;
    }
    const date = fromUnixTime(publishedAt);
    const originalDeleted = posting.receiverDeletedAt != null;
    const nodeName = originalDeleted ? "" : (posting.receiverName ?? posting.ownerName);
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

const connector = connect(
    (state: ClientState) => ({
        timeRelative: getSetting(state, "posting.time.relative") as boolean,
        pulse: getSetting(state, "posting.time.relative") ? state.pulse.pulse : null // To force re-rendering only
    })
);

export default connector(PostingDate);
