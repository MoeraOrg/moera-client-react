import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';

import { ClientState } from "state/state";
import { getCommentsReceiverName, getCommentsState, getDetailedPostingId } from "state/detailedposting/selectors";
import { Loading } from "ui/control";
import CommentOwner from "ui/comment/CommentOwner";
import CommentDate from "ui/comment/CommentDate";
import CommentUpdated from "ui/comment/CommentUpdated";
import EntryHtml from "ui/entry/EntryHtml";
import EntryGallery from "ui/entry/EntryGallery";
import EntryLinkPreviews from "ui/entry/EntryLinkPreviews";
import { REL_CURRENT } from "util/rel-node-name";

export default function GlanceComment() {
    const loading = useSelector((state: ClientState) => getCommentsState(state).loadingGlanceComment);
    const loaded = useSelector((state: ClientState) => getCommentsState(state).loadedGlanceComment);
    const postingId = useSelector(getDetailedPostingId);
    const receiverName = useSelector(getCommentsReceiverName);
    const comment = useSelector((state: ClientState) => getCommentsState(state).glanceComment);

    if (!loaded || loading || postingId == null || comment == null) {
        return (loading ? <Loading/> : null);
    }

    return (
        <div className={cx("comment", "entry", {"single-emoji": comment.singleEmoji})}>
            <div className="details">
                <div className="owner-line">
                    <CommentOwner comment={comment} popup={false}/>
                    <CommentDate postingId={postingId} commentId={comment.id} createdAt={comment.createdAt}/>
                    {comment.totalRevisions > 1 &&
                        <CommentUpdated createdAt={comment.createdAt} editedAt={comment.editedAt}/>
                    }
                </div>
                <div className="content">
                    <EntryHtml postingId={comment.postingId} commentId={comment.id} html={comment.body.text}
                               nodeName={receiverName ?? REL_CURRENT} media={comment.media}/>
                </div>
                <EntryLinkPreviews nodeName={receiverName ?? REL_CURRENT} linkPreviews={comment.body.linkPreviews}
                                   media={comment.media ?? null}/>
                <EntryGallery postingId={comment.postingId} commentId={comment.id}
                              nodeName={receiverName ?? REL_CURRENT} media={comment.media ?? null}/>
                <div className="reactions-line">
                    <div className="comment-buttons"/>
                    <div className="reactions"/>
                </div>
            </div>
        </div>
    );
}
