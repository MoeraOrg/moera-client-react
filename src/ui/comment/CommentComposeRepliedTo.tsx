import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { commentRepliedToUnset } from "state/detailedposting/actions";
import { getDetailedPostingId } from "state/detailedposting/selectors";
import RepliedTo from "ui/comment/RepliedTo";
import { htmlEntities, replaceEmojis } from "util/html";

type Props = ConnectedProps<typeof connector>;

function CommentComposeRepliedTo({postingId, commentId, ownerName, ownerFullName, heading,
                                  commentRepliedToUnset}: Props) {
    const onUnset = () => {commentRepliedToUnset();};

    if (postingId == null || commentId == null || ownerName == null) {
        return null;
    }

    return (
        <RepliedTo postingId={postingId} commentId={commentId} ownerName={ownerName} ownerFullName={ownerFullName}
                   headingHtml={replaceEmojis(htmlEntities(heading ?? ""))} unset={true} onUnset={onUnset}/>
    );
}

const connector = connect(
    (state: ClientState) => ({
        postingId: getDetailedPostingId(state),
        commentId: state.detailedPosting.compose.repliedToId,
        ownerName: state.detailedPosting.compose.repliedToName,
        ownerFullName: state.detailedPosting.compose.repliedToFullName,
        heading: state.detailedPosting.compose.repliedToHeading,
    }),
    { commentRepliedToUnset }
);

export default connector(CommentComposeRepliedTo);
