import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { format, formatDistanceToNow, fromUnixTime } from 'date-fns';

import { ClientState } from "state/state";
import { CommentInfo } from "api/node/api-types";
import Jump from "ui/navigation/Jump";
import "./CommentDate.css"

type Props = {
    nodeName?: string | null;
    postingId: string;
    comment: CommentInfo;
} & ConnectedProps<typeof connector>;

function CommentDate({nodeName, postingId, comment}: Props) {
    const date = fromUnixTime(comment.createdAt);
    return (
        <Jump className="date" nodeName={nodeName} title={format(date, "dd-MM-yyyy HH:mm")}
              href={`/post/${postingId}?comment=${comment.id}`}>
            {formatDistanceToNow(date)}
        </Jump>
    );
}

const connector = connect(
    (state: ClientState) => ({
        pulse: state.pulse.pulse // To force re-rendering only
    })
);

export default connector(CommentDate);
