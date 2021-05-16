import React from 'react';
import { connect } from 'react-redux';

import CommentReactionButton from "ui/comment/CommentReactionButton";
import CommentReplyButton from "ui/comment/CommentReplyButton";
import CommentShareButton from "ui/comment/CommentShareButton";
import { getHomeOwnerName } from "state/home/selectors";
import { getSetting } from "state/settings/selectors";
import "./CommentButtons.css";

function CommentButtons({nodeName, postingId, comment, homeOwnerName, enableSelf}) {
    const cr = comment.clientReaction || {};
    const hide = comment.ownerName === homeOwnerName && !enableSelf && !cr.emoji;
    return (
        <div className="comment-buttons">
            <CommentReactionButton icon="thumbs-up" caption="Support" invisible={hide || (cr.emoji && cr.negative)}
                                   id={comment.id} negative={false} emoji={!cr.negative ? cr.emoji : null}
                                   accepted={comment.acceptedReactions.positive}/>
            <CommentReactionButton icon="thumbs-down" caption="Oppose" invisible={hide || (cr.emoji && !cr.negative)}
                                   id={comment.id} negative={true} emoji={cr.negative ? cr.emoji : null}
                                   accepted={comment.acceptedReactions.negative}/>
            <CommentReplyButton comment={comment}/>
            <CommentShareButton nodeName={nodeName} postingId={postingId} comment={comment}/>
        </div>
    );
}

export default connect(
    state => ({
        homeOwnerName: getHomeOwnerName(state),
        enableSelf: getSetting(state, "comment.reactions.self.enabled")
    })
)(CommentButtons);
