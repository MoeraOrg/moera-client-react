import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getDetailedPostingId } from "state/detailedposting/selectors";
import RepliedTo from "ui/comment/RepliedTo";
import "./CommentRepliedTo.css";

const CommentRepliedTo = ({comment, postingId, previousId}) => {
    if (!comment.repliedTo) {
        return null;
    }
    if (comment.repliedTo.id === previousId) {
        return <div className="replied-to-previous"><FontAwesomeIcon icon="reply"/></div>;
    }
    return (
        <RepliedTo postingId={postingId} commentId={comment.repliedTo.id} ownerName={comment.repliedTo.name}
                   ownerFullName={comment.repliedTo.fullName} headingHtml={comment.repliedTo.headingHtml}
                   unset={false}/>
    );
};

export default connect(
    state => ({
        postingId: getDetailedPostingId(state)
    })
)(CommentRepliedTo);
