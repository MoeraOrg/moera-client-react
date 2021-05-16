import React from 'react';
import { connect } from 'react-redux';

import { commentRepliedToUnset } from "state/detailedposting/actions";
import { getDetailedPostingId } from "state/detailedposting/selectors";
import RepliedTo from "ui/comment/RepliedTo";
import { htmlEntities, replaceEmojis } from "util/html";

function CommentComposeRepliedTo({postingId, commentId, ownerName, ownerFullName, heading, commentRepliedToUnset}) {
    const onUnset = () => commentRepliedToUnset();

    if (commentId == null) {
        return null;
    }

    return (
        <RepliedTo postingId={postingId} commentId={commentId} ownerName={ownerName} ownerFullName={ownerFullName}
                   headingHtml={replaceEmojis(htmlEntities(heading))} unset={true} onUnset={onUnset}/>
    );
}

export default connect(
    state => ({
        postingId: getDetailedPostingId(state),
        commentId: state.detailedPosting.compose.repliedToId,
        ownerName: state.detailedPosting.compose.repliedToName,
        ownerFullName: state.detailedPosting.compose.repliedToFullName,
        heading: state.detailedPosting.compose.repliedToHeading,
    }),
    { commentRepliedToUnset }
)(CommentComposeRepliedTo);
