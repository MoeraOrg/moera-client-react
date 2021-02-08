import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import { Loading } from "ui/control";
import CommentOwner from "ui/comment/CommentOwner";
import CommentDate from "ui/comment/CommentDate";
import CommentUpdated from "ui/comment/CommentUpdated";
import CommentReactions from "ui/comment/CommentReactions";
import EntryHtml from "ui/posting/EntryHtml";
import { getCommentsState, getDetailedPostingId } from "state/detailedposting/selectors";

const GlanceComment = ({loading, loaded, postingId, comment}) => (
    loaded && !loading && comment != null ?
        <div className={cx("comment", "entry", {"single-emoji": comment.singleEmoji})}>
            <div className="owner-line">
                <CommentOwner comment={comment} popup={false}/>
                <CommentDate postingId={postingId} comment={comment}/>
                <CommentUpdated comment={comment}/>
            </div>
            <div className="content">
                <EntryHtml html={comment.body.text}/>
            </div>
            <div className="reactions-line">
                <div className="comment-buttons"/>
                <CommentReactions postingId={postingId} comment={comment}/>
            </div>
        </div>
    :
        <Loading active={loading}/>
);

export default connect(
    state => ({
        loading: getCommentsState(state).loadingGlanceComment,
        loaded: getCommentsState(state).loadedGlanceComment,
        postingId: getDetailedPostingId(state),
        comment: getCommentsState(state).glanceComment
    })
)(GlanceComment);
