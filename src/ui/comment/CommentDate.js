import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import Jump from "ui/navigation/Jump";
import "./CommentDate.css"

const CommentDate = ({comment}) => {
    const date = moment.unix(comment.createdAt);
    return (
        <Jump className="date" href={`/post/${comment.postingId}?comment=${comment.id}`}>
            <span title={date.format("DD-MM-YYYY HH:mm")}>{date.fromNow()}</span>
        </Jump>
    );
};

export default connect(
    state => ({
        pulse: state.pulse.pulse // To force re-rendering only
    })
)(CommentDate);
