import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { goToPosting } from "state/navigation/actions";
import { getSetting } from "state/settings/selectors";
import "./PostingDate.css"

const PostingDate = ({id, publishedAt, rootLocation, timeRelative, goToPosting}) => {
    const date = moment.unix(publishedAt);
    return (
        <a className="date" href={`${rootLocation}/post/${id}`} onClick={e => {
            goToPosting(id);
            e.preventDefault();
        }}>{
            timeRelative ?
                <span title={date.format("DD-MM-YYYY HH:mm")}>{date.fromNow()}</span>
            :
                date.format("DD-MM-YYYY HH:mm")
        }</a>
    );
};

export default connect(
    state => ({
        rootLocation: state.node.root.location,
        timeRelative: getSetting(state, "posting.time.relative")
    }),
    { goToPosting }
)(PostingDate);
