import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getCommentsState, getDetailedPosting } from "state/detailedposting/selectors";
import { commentsLoadAll } from "state/detailedposting/actions";
import "./CommentsLoadAllButton.css";

export default function CommentsLoadAllButton() {
    const totalInPast = useSelector((state: ClientState) => getCommentsState(state).totalInPast);
    const loadedCount = useSelector((state: ClientState) => getCommentsState(state).comments.length);
    const totalCount = useSelector((state: ClientState) => getDetailedPosting(state)?.totalComments ?? 0);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    if (totalCount <= 0) {
        return null;
    }

    const onClick = () => dispatch(commentsLoadAll());

    return (
        <button className="comments-load-all" title={t("load-all-comments")} onClick={onClick}
                disabled={loadedCount >= totalCount}>
            {loadedCount > 0 ? `${totalInPast + 1}..${totalInPast + loadedCount}` : "0"} of {totalCount}
        </button>
    );
}
