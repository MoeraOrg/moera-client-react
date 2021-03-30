import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import { isConnectedToHome } from "state/home/selectors";
import { isPermitted } from "state/node/selectors";
import CommentMenu from "ui/comment/CommentMenu";
import CommentOwner from "ui/comment/CommentOwner";
import CommentDate from "ui/comment/CommentDate";
import CommentUpdated from "ui/comment/CommentUpdated";
import CommentDeleting from "ui/comment/CommentDeleting";
import CommentContent from "ui/comment/CommentContent";
import CommentButtons from "ui/comment/CommentButtons";
import CommentReactions from "ui/comment/CommentReactions";
import { getCommentsReceiverPostingId, getCommentsState, getDetailedPosting } from "state/detailedposting/selectors";
import "./Comment.css";


const Comment = ({
     postingId, comment, previousId, focused, connectedToHome, postingOwnerName, postingReceiverName,
     postingReceiverPostingId, isPermitted
}) => (
    <div className={cx("comment", "entry", {
        "focused": focused,
        "single-emoji": comment.singleEmoji,
        "topic-starter": comment.ownerName === postingReceiverName
    })} data-moment={comment.moment}>
        {comment.deleting ?
            <CommentDeleting/>
        :
            <>
                <CommentMenu comment={comment} postingId={postingId} isPermitted={isPermitted}/>
                <div className="owner-line">
                    <CommentOwner comment={comment}/>
                    <CommentDate nodeName={postingReceiverName ?? postingOwnerName}
                                 postingId={postingReceiverPostingId ?? postingId} comment={comment}/>
                    <CommentUpdated comment={comment}/>
                </div>
                <CommentContent className="content" comment={comment} previousId={previousId}/>
                <div className="reactions-line">
                    {connectedToHome && comment.signature != null &&
                        <CommentButtons nodeName={postingReceiverName ?? postingOwnerName}
                                        postingId={postingReceiverPostingId ?? postingId} comment={comment}/>
                    }
                    <CommentReactions postingId={postingId} comment={comment}/>
                </div>
            </>
        }
    </div>
);

export default connect(
    state => ({
        connectedToHome: isConnectedToHome(state),
        postingOwnerName: getDetailedPosting(state).ownerName,
        postingReceiverName: getCommentsState(state).receiverName,
        postingReceiverPostingId: getCommentsReceiverPostingId(state),
        isPermitted: (operation, comment) =>
            isPermitted(operation, comment, state, getCommentsState(state).receiverName)
    })
)(Comment);
