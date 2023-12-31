import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackwardFast, faForwardFast } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getCommentsState, getDetailedPosting } from "state/detailedposting/selectors";
import { commentsScrollToAnchor } from "state/detailedposting/actions";
import "./CommentsRewindButton.css";

interface Props {
    end: boolean;
    forward: boolean;
}

export default function CommentsRewindButton({end, forward}: Props) {
    const before = useSelector((state: ClientState) => getCommentsState(state).before);
    const after = useSelector((state: ClientState) => getCommentsState(state).after);
    const total = useSelector((state: ClientState) => getDetailedPosting(state)?.totalComments ?? 0);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const visible = total > 1
        && ((end && (!forward || before < Number.MAX_SAFE_INTEGER))
            || (!end && (forward || after > Number.MIN_SAFE_INTEGER)));

    if (!visible) {
        return null;
    }

    const onClick = () =>
        dispatch(commentsScrollToAnchor(forward ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER + 1));

    return (
        <button className="comments-rewind" title={forward ? t("go-last-comment") : t("go-first-comment")}
                onClick={onClick}>
            <FontAwesomeIcon icon={forward ? faForwardFast : faBackwardFast}/>
        </button>
    )
}
