import React from 'react';
import { connect } from 'react-redux';

import { getCommentsState, getDetailedPosting } from "state/detailedposting/selectors";
import { commentsLoadAll } from "state/detailedposting/actions";

const CommentsLoadAllButton = ({loadedCount, totalCount, commentsLoadAll}) => (
    totalCount > 0 && loadedCount < totalCount &&
        <button className="comments-load-all" title="Load add comments" onClick={commentsLoadAll}>
            {loadedCount} of {totalCount}
        </button>
);

export default connect(
    state => ({
        loadedCount: getCommentsState(state).comments.length,
        totalCount: getDetailedPosting(state).totalComments
    }),
    { commentsLoadAll }
)(CommentsLoadAllButton);
