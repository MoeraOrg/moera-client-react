import React from 'react';
import { connect } from 'react-redux';

import { getCommentsState, getDetailedPosting } from "state/detailedposting/selectors";
import { commentsLoadAll } from "state/detailedposting/actions";
import "./CommentsLoadAllButton.css";

const CommentsLoadAllButton = ({totalInPast, loadedCount, totalCount, commentsLoadAll}) => (
    totalCount > 0 &&
        <button className="comments-load-all" title="Load all comments" onClick={commentsLoadAll}
                disabled={loadedCount >= totalCount}>
            {loadedCount > 0 ? `${totalInPast + 1}..${totalInPast + loadedCount}` : "0"} of {totalCount}
        </button>
);

export default connect(
    state => ({
        totalInPast: getCommentsState(state).totalInPast,
        loadedCount: getCommentsState(state).comments.length,
        totalCount: getDetailedPosting(state).totalComments
    }),
    { commentsLoadAll }
)(CommentsLoadAllButton);
