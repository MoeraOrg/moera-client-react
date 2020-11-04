import React from 'react';
import { connect } from 'react-redux';
import { format, formatDistanceToNow, fromUnixTime } from 'date-fns';

import Jump from "ui/navigation/Jump";
import "./CommentDate.css"

const CommentDate = ({nodeName, postingId, comment}) => {
    const date = fromUnixTime(comment.createdAt);
    return (
        <Jump className="date" nodeName={nodeName} href={`/post/${postingId}?comment=${comment.id}`}>
            <span title={format(date, "dd-MM-yyyy HH:mm")}>{formatDistanceToNow(date)}</span>
        </Jump>
    );
};

export default connect(
    state => ({
        pulse: state.pulse.pulse // To force re-rendering only
    })
)(CommentDate);
