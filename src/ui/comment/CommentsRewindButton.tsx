import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getCommentsState, getDetailedPosting } from "state/detailedposting/selectors";
import { commentsScrollToAnchor } from "state/detailedposting/actions";
import "./CommentsRewindButton.css";

type Props = {
    end: boolean;
    forward: boolean;
} & ConnectedProps<typeof connector>;

function CommentsRewindButton({end, forward, before, after, total, commentsScrollToAnchor}: Props) {
    const {t} = useTranslation();

    const visible = total > 1
        && ((end && (!forward || before < Number.MAX_SAFE_INTEGER))
            || (!end && (forward || after > Number.MIN_SAFE_INTEGER)));

    if (!visible) {
        return null;
    }

    const onClick = () => commentsScrollToAnchor(forward ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER + 1);

    return (
        <button className="comments-rewind" title={forward ? t("go-last-comment") : t("go-first-comment")}
                onClick={onClick}>
            <FontAwesomeIcon icon={["fas", forward ? "forward-fast" : "backward-fast"]}/>
        </button>
    )
}

const connector = connect(
    (state: ClientState) => ({
        before: getCommentsState(state).before,
        after: getCommentsState(state).after,
        total: getDetailedPosting(state)?.totalComments ?? 0
    }),
    { commentsScrollToAnchor }
);

export default connector(CommentsRewindButton);
