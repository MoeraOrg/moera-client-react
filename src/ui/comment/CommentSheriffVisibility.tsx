import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { CommentInfo } from "api";
import { ClientState } from "state/state";
import { getDetailedPosting, isCommentSheriffProhibited } from "state/detailedposting/selectors";
import { SheriffVisibility } from "ui/control";

interface OwnProps {
    comment: CommentInfo;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

const CommentSheriffVisibility = ({invisible}: Props) => <SheriffVisibility invisible={invisible}/>;

const connector = connect(
    (state: ClientState, ownProps: OwnProps) => ({
        invisible: isCommentSheriffProhibited(getDetailedPosting(state), ownProps.comment, SHERIFF_GOOGLE_PLAY_TIMELINE)
    })
);

export default connector(CommentSheriffVisibility);
