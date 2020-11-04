import React from 'react';
import { connect } from 'react-redux';
import { format, formatDistanceToNow, fromUnixTime } from 'date-fns';

const CommentUpdated = ({comment}) => {
    if (comment.totalRevisions <= 1) {
        return null;
    }

    const date = fromUnixTime(comment.editedAt);
    return (
        <span className="date">
            {" "}(updated <abbr title={format(date, "dd-MM-yyyy HH:mm")}>{formatDistanceToNow(date)}</abbr>)
        </span>
    );
};

export default connect(
    state => ({
        pulse: state.pulse.pulse // To force re-rendering only
    })
)(CommentUpdated);
