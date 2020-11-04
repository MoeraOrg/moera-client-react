import React from 'react';
import { connect } from 'react-redux';
import { format, formatDistanceToNow, fromUnixTime } from 'date-fns';

import { getSetting } from "state/settings/selectors";
import Jump from "ui/navigation/Jump";
import "./PostingDate.css"

const PostingDate = ({posting, story, timeRelative}) => {
    let publishedAt;
    if (posting.receiverName) {
        publishedAt = posting.receiverCreatedAt;
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
};

export default connect(
    state => ({
        timeRelative: getSetting(state, "posting.time.relative"),
        pulse: getSetting(state, "posting.time.relative") ? state.pulse.pulse : null // To force re-rendering only
    })
)(PostingDate);
