import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getCommentsState, getDetailedPosting } from "state/detailedposting/selectors";
import { commentsLoadAll } from "state/detailedposting/actions";
import "./CommentsLoadAllButton.css";

type Props = ConnectedProps<typeof connector>;

const CommentsLoadAllButton = ({totalInPast, loadedCount, totalCount, commentsLoadAll}: Props) => {
    const {t} = useTranslation();

    if (totalCount <= 0) {
        return null;
    }

    return (
        <button className="comments-load-all" title={t("load-all-comments")} onClick={commentsLoadAll}
                disabled={loadedCount >= totalCount}>
            {loadedCount > 0 ? `${totalInPast + 1}..${totalInPast + loadedCount}` : "0"} of {totalCount}
        </button>
    );
}

const connector = connect(
    (state: ClientState) => ({
            totalInPast: getCommentsState(state).totalInPast,
            loadedCount: getCommentsState(state).comments.length,
            totalCount: getDetailedPosting(state)?.totalComments ?? 0
    }),
    { commentsLoadAll }
);

export default connector(CommentsLoadAllButton);
