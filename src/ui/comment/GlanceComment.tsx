import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cx from 'classnames';

import { ClientState } from "state/state";
import { getCommentsState, getDetailedPostingId } from "state/detailedposting/selectors";
import { Loading } from "ui/control";
import CommentOwner from "ui/comment/CommentOwner";
import CommentDate from "ui/comment/CommentDate";
import CommentUpdated from "ui/comment/CommentUpdated";
import EntryHtml from "ui/entry/EntryHtml";
import EntryGallery from "ui/entry/EntryGallery";
import EntryLinkPreviews from "ui/entry/EntryLinkPreviews";

type Props = ConnectedProps<typeof connector>;

const GlanceComment = ({loading, loaded, postingId, receiverName, comment}: Props) => (
    loaded && !loading && postingId != null && comment != null ?
        <div className={cx("comment", "entry", {"single-emoji": comment.singleEmoji})}>
            <div className="details">
                <div className="owner-line">
                    <CommentOwner comment={comment} popup={false}/>
                    <CommentDate postingId={postingId} comment={comment}/>
                    <CommentUpdated comment={comment}/>
                </div>
                <div className="content">
                    <EntryHtml postingId={comment.postingId} commentId={comment.id} html={comment.body.text}
                               nodeName={receiverName} media={comment.media}/>
                </div>
                <EntryLinkPreviews nodeName={receiverName} linkPreviews={comment.body.linkPreviews}
                                   media={comment.media ?? null}/>
                <EntryGallery postingId={comment.postingId} commentId={comment.id} nodeName={receiverName}
                              media={comment.media ?? null}/>
                <div className="reactions-line">
                    <div className="comment-buttons"/>
                    <div className="reactions"/>
                </div>
            </div>
        </div>
    :
        (loading ? <Loading/> : null)
);

const connector = connect(
    (state: ClientState) => ({
        loading: getCommentsState(state).loadingGlanceComment,
        loaded: getCommentsState(state).loadedGlanceComment,
        postingId: getDetailedPostingId(state),
        receiverName: getCommentsState(state).receiverName,
        comment: getCommentsState(state).glanceComment
    })
);

export default connector(GlanceComment);
