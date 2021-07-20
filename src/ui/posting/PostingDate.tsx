import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { format, formatDistanceToNow, fromUnixTime } from 'date-fns';

import { FeedReference, PostingInfo } from "api/node/api-types";
import { getSetting } from "state/settings/selectors";
import Jump from "ui/navigation/Jump";
import { ClientState } from "state/state";
import "./PostingDate.css"

type Props = {
    posting: PostingInfo;
    story: FeedReference | null;
} & ConnectedProps<typeof connector>;

function PostingDate({posting, story, timeRelative}: Props) {
    let publishedAt;
    if (posting.receiverName) {
        publishedAt = posting.receiverCreatedAt ?? posting.createdAt;
    } else {
        publishedAt = story != null ? story.publishedAt : posting.createdAt;
    }
    const date = fromUnixTime(publishedAt);
    const nodeName = posting.receiverName ?? posting.ownerName;
    const postingId = posting.receiverPostingId ?? posting.id;
    return (
        <Jump className="date" nodeName={nodeName} href={`/post/${postingId}`}>{
            timeRelative ?
                <span title={format(date, "dd-MM-yyyy HH:mm")}>{formatDistanceToNow(date)}</span>
            :
                <span title={formatDistanceToNow(date)}>{format(date, "dd-MM-yyyy HH:mm")}</span>
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
