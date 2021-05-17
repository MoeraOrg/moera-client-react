import React from 'react';
import { connect } from 'react-redux';
import { format, formatDistanceToNow, fromUnixTime } from 'date-fns';

import Jump from "ui/navigation/Jump";
import "./CommentDate.css"

function CommentDate({nodeName, postingId, comment}) {
    const date = fromUnixTime(comment.createdAt);
    return (
        <Jump className="date" nodeName={nodeName} title={format(date, "dd-MM-yyyy HH:mm")}
              href={`/post/${postingId}?comment=${comment.id}`}>
            {formatDistanceToNow(date)}
        </Jump>
    );
}

export default connect(
    state => ({
        pulse: state.pulse.pulse // To force re-rendering only
    })
)(CommentDate);
