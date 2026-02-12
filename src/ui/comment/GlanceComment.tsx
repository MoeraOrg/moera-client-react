import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';

import { ClientState } from "state/state";
import {
    getCommentsReceiverName,
    getCommentsState,
    getDetailedPosting,
    getDetailedPostingId
} from "state/detailedposting/selectors";
import { Loading } from "ui/control";
import CommentOwner from "ui/comment/CommentOwner";
import CommentDate from "ui/comment/CommentDate";
import CommentUpdated from "ui/comment/CommentUpdated";
import EntryHtml from "ui/entry/EntryHtml";
import EntryGallery from "ui/entry/EntryGallery";
import EntryLinkPreviews from "ui/entry/EntryLinkPreviews";

export default function GlanceComment() {
    const loading = useSelector((state: ClientState) => getCommentsState(state).loadingGlanceComment);
    const loaded = useSelector((state: ClientState) => getCommentsState(state).loadedGlanceComment);
    const postingId = useSelector(getDetailedPostingId);
    const postingOwnerName = useSelector((state: ClientState) => getDetailedPosting(state)?.ownerName);
    const receiverName = useSelector(getCommentsReceiverName);
    const comment = useSelector((state: ClientState) => getCommentsState(state).glanceComment);

    const realOwnerName = receiverName ?? postingOwnerName;
    if (!loaded || loading || postingId == null || realOwnerName == null || comment == null) {
        return (loading ? <Loading/> : null);
    }

    return (
        <div className={cx("comment", "entry", {"single-emoji": comment.singleEmoji})}>
            <div className="owner-line">
                <CommentOwner comment={comment} popup={false}/>
                <span>
                    <CommentDate postingId={postingId} commentId={comment.id} createdAt={comment.createdAt}/>
                    {comment.totalRevisions > 1 &&
                        <CommentUpdated createdAt={comment.createdAt} editedAt={comment.editedAt}/>
                    }
                </span>
            </div>
            <div className="content">
                <EntryHtml
                    postingId={comment.postingId}
                    commentId={comment.id}
                    html={comment.body.text}
                    nodeName={realOwnerName}
                    media={comment.media}
                />
            </div>
            <EntryGallery
                postingId={comment.postingId}
                commentId={comment.id}
                nodeName={realOwnerName}
                media={comment.media ?? null}
            />
            <EntryLinkPreviews
                nodeName={realOwnerName}
                linkPreviews={comment.body.linkPreviews}
                noFollow={comment.ownerName !== realOwnerName}
                media={comment.media ?? null}
            />
        </div>
    );
}
