import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getCommentsState } from "state/detailedposting/selectors";
import { ClientState } from "state/state";

type Props = {
    end: boolean;
} & ConnectedProps<typeof connector>;

function CommentsLeapButton({end, loadedCount}: Props) {
    if (loadedCount === 0) {
        return null;
    }

    const onClick = () => {
        setTimeout(() => {
            const rect = document.getElementById("comments")!.getBoundingClientRect();
            const y = end ? rect.top : rect.bottom;
            window.scrollBy(0, y - 50);
        });
    }

    return (
        <button className="comments-rewind" title={end ? "Go to the top" : "Go to the bottom"} onClick={onClick}>
            <FontAwesomeIcon icon={end ? "arrow-up" : "arrow-down"}/>
        </button>
    );
}

const connector = connect(
    (state: ClientState) => ({
        loadedCount: getCommentsState(state).comments.length,
    })
);

export default connector(CommentsLeapButton);
