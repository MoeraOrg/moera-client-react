import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { getSetting } from "state/settings/selectors";
import Jump from "ui/navigation/Jump";
import "./PostingDate.css"

const PostingDate = ({id, publishedAt, timeRelative}) => {
    const date = moment.unix(publishedAt);
    return (
        <Jump className="date" href={`/post/${id}`}>{
            timeRelative ?
                <span title={date.format("DD-MM-YYYY HH:mm")}>{date.fromNow()}</span>
            :
                date.format("DD-MM-YYYY HH:mm")
        }</Jump>
    );
};

export default connect(
    state => ({
        timeRelative: getSetting(state, "posting.time.relative")
    })
)(PostingDate);
