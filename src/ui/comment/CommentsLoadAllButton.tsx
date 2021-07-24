import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { getCommentsState, getDetailedPosting } from "state/detailedposting/selectors";
import { commentsLoadAll } from "state/detailedposting/actions";
import "./CommentsLoadAllButton.css";

type Props = ConnectedProps<typeof connector>;

const CommentsLoadAllButton = ({totalInPast, loadedCount, totalCount, commentsLoadAll}: Props) => (
    totalCount > 0 ?
        <button className="comments-load-all" title="Load all comments" onClick={commentsLoadAll}
                disabled={loadedCount >= totalCount}>
            {loadedCount > 0 ? `${totalInPast + 1}..${totalInPast + loadedCount}` : "0"} of {totalCount}
        </button>
    :
        null
);

const connector = connect(
    (state: ClientState) => ({
            totalInPast: getCommentsState(state).totalInPast,
            loadedCount: getCommentsState(state).comments.length,
            totalCount: getDetailedPosting(state)?.totalComments ?? 0
    }),
    { commentsLoadAll }
);

export default connector(CommentsLoadAllButton);
