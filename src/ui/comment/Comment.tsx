import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isConnectedToHome } from "state/home/selectors";
import { ExtCommentInfo } from "state/detailedposting/state";
import {
    getCommentsReceiverName,
    getCommentsReceiverPostingId,
    getDetailedPosting,
    getDetailedPostingId
} from "state/detailedposting/selectors";
import CommentMenu from "ui/comment/CommentMenu";
import CommentAvatar from "ui/comment/CommentAvatar";
import CommentOwner from "ui/comment/CommentOwner";
import CommentInvisible from "ui/comment/CommentInvisible";
import CommentDate from "ui/comment/CommentDate";
import CommentUpdated from "ui/comment/CommentUpdated";
import CommentVisibility from "ui/comment/CommentVisibility";
import CommentDeleting from "ui/comment/CommentDeleting";
import CommentContent from "ui/comment/CommentContent";
import CommentButtons from "ui/comment/CommentButtons";
import CommentReactions from "ui/comment/CommentReactions";
import EntryGallery from "ui/entry/EntryGallery";
import EntryLinkPreviews from "ui/entry/EntryLinkPreviews";
import "./Comment.css";

type Props = {
    comment: ExtCommentInfo;
    previousId: string | null;
    focused: boolean;
} & ConnectedProps<typeof connector>;

const Comment = ({
     comment, previousId, focused, connectedToHome, postingId, postingOwnerName, postingReceiverName,
     postingReceiverPostingId
}: Props) => {
    const {t} = useTranslation();

    const realOwnerName = postingReceiverName ?? postingOwnerName;
    if (postingId == null || realOwnerName == null) {
        return null;
    }
    const realPostingId = postingReceiverPostingId ?? postingId;

    return (
        <div className={cx("comment", "entry", {
            "focused": focused,
            "single-emoji": comment.singleEmoji,
            "topic-starter": comment.ownerName === postingReceiverName
        })} data-moment={comment.moment}>
            {comment.deleting ?
                <CommentDeleting/>
            :
                <>
                    <CommentMenu comment={comment} nodeName={realOwnerName} postingId={postingId}/>
                    <CommentAvatar comment={comment} nodeName={realOwnerName}/>
                    <div className="details">
                        <div className="owner-line">
                            <CommentOwner comment={comment} nodeName={realOwnerName}/>
                            <CommentInvisible comment={comment}/>
                            <CommentDate nodeName={realOwnerName} postingId={realPostingId} comment={comment}/>
                            <CommentUpdated comment={comment}/>
                            <CommentVisibility comment={comment}/>
                        </div>
                        <CommentContent comment={comment} previousId={previousId} receiverName={postingReceiverName}/>
                        <EntryLinkPreviews nodeName={realOwnerName} linkPreviews={comment.body.linkPreviews} limit={2}
                                           media={comment.media ?? null} small/>
                        <EntryGallery postingId={realPostingId} commentId={comment.id} nodeName={realOwnerName}
                                      media={comment.media ?? null}/>
                        <div className="reactions-line">
                            {comment.signature == null && <div className="unsigned">{t("unsigned")}</div>}
                            {connectedToHome && comment.signature != null &&
                                <CommentButtons nodeName={realOwnerName} postingId={realPostingId} comment={comment}/>
                            }
                            <CommentReactions postingId={postingId} comment={comment}/>
                        </div>
                    </div>
                </>
            }
        </div>
    );
}

const connector = connect(
    (state: ClientState) => ({
        connectedToHome: isConnectedToHome(state),
        postingId: getDetailedPostingId(state),
        postingOwnerName: getDetailedPosting(state)?.ownerName,
        postingReceiverName: getCommentsReceiverName(state),
        postingReceiverPostingId: getCommentsReceiverPostingId(state)
    })
);

export default connector(Comment);
