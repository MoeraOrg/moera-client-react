import React from 'react';
import { connect } from 'react-redux';
import { format, formatDistanceToNow, fromUnixTime } from 'date-fns';

import { getSetting } from "state/settings/selectors";

const PostingUpdated = ({posting, story, timeRelative}) => {
    if (posting.totalRevisions <= 1) {
        return null;
    }

    const date = fromUnixTime(posting.editedAt);
    const publishedAt = story != null ? story.publishedAt : posting.createdAt;
    const editedSoon = Math.abs(posting.editedAt - publishedAt) < 24 * 60 * 60;
    return (
        <span className="date">
            {" "}(updated {
                timeRelative ?
                    <abbr title={format(date, "dd-MM-yyyy HH:mm")}>{formatDistanceToNow(date)}</abbr>
                :
                    (editedSoon ? format(date, "HH:mm") : format(date, "dd-MM-yyyy HH:mm"))
            })
        </span>
    );
};

export default connect(
    state => ({
        timeRelative: getSetting(state, "posting.time.relative"),
        pulse: getSetting(state, "posting.time.relative") ? state.pulse.pulse : null // To force re-rendering only
    })
)(PostingUpdated);
