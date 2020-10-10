import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

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
    const date = moment.unix(publishedAt);
    const nodeName = posting.receiverName ?? posting.ownerName;
    const postingId = posting.receiverPostingId ?? posting.id;
    return (
        <Jump className="date" nodeName={nodeName} href={`/post/${postingId}`}>{
            timeRelative ?
                <span title={date.format("DD-MM-YYYY HH:mm")}>{date.fromNow()}</span>
            :
                date.format("DD-MM-YYYY HH:mm")
        }</Jump>
    );
};

export default connect(
    state => ({
        timeRelative: getSetting(state, "posting.time.relative"),
        pulse: getSetting(state, "posting.time.relative") ? state.pulse.pulse : null // To force re-rendering only
    })
)(PostingDate);
