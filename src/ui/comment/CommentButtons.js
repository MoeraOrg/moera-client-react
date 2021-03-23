import React from 'react';

import CommentReactionButton from "ui/comment/CommentReactionButton";
import CommentReplyButton from "ui/comment/CommentReplyButton";
import CommentShareButton from "ui/comment/CommentShareButton";
import "./CommentButtons.css";

const CommentButtons = ({nodeName, postingId, comment}) => {
    const cr = comment.clientReaction || {};
    return (
        <div className="comment-buttons">
            <CommentReactionButton icon="thumbs-up" caption="Support" invisible={cr.emoji && cr.negative}
                                   id={comment.id} negative={false} emoji={!cr.negative ? cr.emoji : null}
                                   accepted={comment.acceptedReactions.positive}/>
            <CommentReactionButton icon="thumbs-down" caption="Oppose" invisible={cr.emoji && !cr.negative}
                                   id={comment.id} negative={true} emoji={cr.negative ? cr.emoji : null}
                                   accepted={comment.acceptedReactions.negative}/>
            <CommentReplyButton comment={comment}/>
            <CommentShareButton nodeName={nodeName} postingId={postingId} comment={comment}/>
        </div>
    );
};

export default CommentButtons;
