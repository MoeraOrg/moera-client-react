import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { ClientState } from "state/state";
import { getHomeOwnerName, isConnectedToHome } from "state/home/selectors";
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
import CommentSheriffVisibility from "ui/comment/CommentSheriffVisibility";
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

interface Props {
    comment: ExtCommentInfo;
    previousId: string | null;
    focused: boolean;
}

export default function Comment({comment, previousId, focused}: Props) {
    const connectedToHome = useSelector(isConnectedToHome);
    const isSheriff = useSelector((state: ClientState) => getHomeOwnerName(state) === SHERIFF_GOOGLE_PLAY_TIMELINE);
    const postingId = useSelector(getDetailedPostingId);
    const postingOwnerName = useSelector((state: ClientState) => getDetailedPosting(state)?.ownerName);
    const postingReceiverName = useSelector(getCommentsReceiverName);
    const postingReceiverPostingId = useSelector(getCommentsReceiverPostingId);
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
                    <div className="owner-line">
                        <span>
                            <CommentAvatar ownerName={comment.ownerName} ownerFullName={comment.ownerFullName}
                                           avatar={comment.ownerAvatar} nodeName={realOwnerName}/>
                            <CommentOwner comment={comment} nodeName={realOwnerName}/>
                            {comment.invisible && <CommentInvisible/>}
                            {isSheriff &&
                                <CommentSheriffVisibility comment={comment}/>
                            }
                        </span>
                        <span>
                            <CommentVisibility comment={comment}/>
                            <CommentDate nodeName={realOwnerName} postingId={realPostingId} commentId={comment.id}
                                         createdAt={comment.createdAt}/>
                            {comment.totalRevisions > 1 &&
                                <CommentUpdated createdAt={comment.createdAt} editedAt={comment.editedAt}/>
                            }
                        </span>
                    </div>
                    <CommentContent comment={comment} previousId={previousId} receiverName={realOwnerName}/>
                    <EntryGallery postingId={realPostingId} commentId={comment.id} nodeName={realOwnerName}
                                  media={comment.media ?? null}/>
                    <EntryLinkPreviews nodeName={realOwnerName} linkPreviews={comment.body.linkPreviews} limit={2}
                                       media={comment.media ?? null} small/>
                    <div className="reactions-line">
                        {comment.signature == null && <div className="unsigned">{t("unsigned")}</div>}
                        {connectedToHome && comment.signature != null &&
                            <CommentButtons nodeName={realOwnerName} postingId={realPostingId} comment={comment}/>
                        }
                        <CommentReactions commentId={comment.id} reactions={comment.reactions ?? null}
                                          seniorReaction={comment.seniorReaction ?? null}/>
                    </div>
                </>
            }
        </div>
    );
}
