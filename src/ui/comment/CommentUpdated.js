import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

const CommentUpdated = ({comment}) => {
    if (comment.totalRevisions <= 1) {
        return null;
    }

    const date = moment.unix(comment.editedAt);
    return (
        <span className="date">
            {" "}(updated <abbr title={date.format("DD-MM-YYYY HH:mm")}>{date.fromNow()}</abbr>)
        </span>
    );
};

export default connect(
    state => ({
        pulse: state.pulse.pulse // To force re-rendering only
    })
)(CommentUpdated);
