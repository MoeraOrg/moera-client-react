import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { PostingInfo } from "api";
import { ClientState } from "state/state";
import { isPostingSheriffProhibited } from "state/postings/selectors";
import { SheriffVisibility } from "ui/control";

interface OwnProps {
    posting: PostingInfo;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

const PostingSheriffVisibility = ({invisible}: Props) => <SheriffVisibility invisible={invisible}/>;

const connector = connect(
    (state: ClientState, ownProps: OwnProps) => ({
        invisible: isPostingSheriffProhibited(ownProps.posting, SHERIFF_GOOGLE_PLAY_TIMELINE)
    })
);

export default connector(PostingSheriffVisibility);
