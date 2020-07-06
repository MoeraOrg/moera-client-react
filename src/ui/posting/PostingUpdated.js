import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { getSetting } from "state/settings/selectors";

const PostingUpdated = ({posting, story, timeRelative}) => {
    if (posting.totalRevisions <= 1) {
        return null;
    }

    const date = moment.unix(posting.editedAt);
    const publishedAt = story != null ? story.publishedAt : posting.createdAt;
    const editedSoon = Math.abs(posting.editedAt - publishedAt) < 24 * 60 * 60;
    return (
        <span className="date">
            {" "}(updated {
                timeRelative ?
                    <abbr title={date.format("DD-MM-YYYY HH:mm")}>{date.fromNow()}</abbr>
                :
                    (editedSoon ? date.format("HH:mm") : date.format("DD-MM-YYYY HH:mm"))
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
