import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cx from 'classnames';

import { isConnectedToHome } from "state/home/selectors";
import { ClientState } from "state/state";
import { CommentInfo } from "api/node/api-types";
import { ExtCommentInfo } from "state/detailedposting/state";
import { isPermitted } from "state/node/selectors";
import CommentMenu from "ui/comment/CommentMenu";
import CommentAvatar from "ui/comment/CommentAvatar";
import CommentOwner from "ui/comment/CommentOwner";
import CommentDate from "ui/comment/CommentDate";
import CommentUpdated from "ui/comment/CommentUpdated";
import CommentDeleting from "ui/comment/CommentDeleting";
import CommentContent from "ui/comment/CommentContent";
import CommentButtons from "ui/comment/CommentButtons";
import CommentReactions from "ui/comment/CommentReactions";
import { getCommentsReceiverPostingId, getCommentsState, getDetailedPosting } from "state/detailedposting/selectors";
import "./Comment.css";

type Props = {
    postingId: string;
    comment: ExtCommentInfo;
    previousId: string | null;
    focused: boolean;
} & ConnectedProps<typeof connector>;

const Comment = ({
     postingId, comment, previousId, focused, connectedToHome, postingOwnerName, postingReceiverName,
     postingReceiverPostingId, isPermitted
}: Props) => (
    <div className={cx("comment", "entry", {
        "focused": focused,
        "single-emoji": comment.singleEmoji,
        "topic-starter": comment.ownerName === postingReceiverName
    })} data-moment={comment.moment}>
        {comment.deleting ?
            <CommentDeleting/>
        :
            <>
                <CommentMenu comment={comment} nodeName={postingReceiverName ?? postingOwnerName} postingId={postingId}
                             isPermitted={isPermitted}/>
                <CommentAvatar comment={comment} nodeName={postingReceiverName ?? postingOwnerName}/>
                <div className="details">
                    <div className="owner-line">
                        <CommentOwner comment={comment} nodeName={postingReceiverName ?? postingOwnerName}/>
                        <CommentDate nodeName={postingReceiverName ?? postingOwnerName}
                                     postingId={postingReceiverPostingId ?? postingId} comment={comment}/>
                        <CommentUpdated comment={comment}/>
                    </div>
                    <CommentContent comment={comment} previousId={previousId}/>
                    <div className="reactions-line">
                        {connectedToHome && comment.signature != null &&
                            <CommentButtons nodeName={postingReceiverName ?? postingOwnerName}
                                            postingId={postingReceiverPostingId ?? postingId} comment={comment}/>
                        }
                        <CommentReactions postingId={postingId} comment={comment}/>
                    </div>
                </div>
            </>
        }
    </div>
);

const connector = connect(
    (state: ClientState) => ({
        connectedToHome: isConnectedToHome(state),
        postingOwnerName: getDetailedPosting(state)?.ownerName,
        postingReceiverName: getCommentsState(state).receiverName,
        postingReceiverPostingId: getCommentsReceiverPostingId(state),
        isPermitted: (operation: string, comment: CommentInfo) =>
            isPermitted(operation, comment, state, getCommentsState(state).receiverName)
    })
);

export default connector(Comment);
