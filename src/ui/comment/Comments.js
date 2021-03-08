import React from 'react';
import { connect } from 'react-redux';

import {
    commentsFutureSliceLoad,
    commentsPastSliceLoad,
    commentsScrolledToAnchor,
    commentsScrolledToComments,
    commentsScrolledToComposer
} from "state/detailedposting/actions";
import {
    getCommentsState,
    getDetailedPosting,
    getDetailedPostingId,
    isCommentComposerFocused,
    isCommentsFocused, isDetailedPostingCached
} from "state/detailedposting/selectors";
import { isAtDetailedPostingPage } from "state/navigation/selectors";
import CommentsSentinelLine from "ui/comment/CommentsSentinelLine";
import Comment from "ui/comment/Comment";
import CommentCompose from "ui/comment/CommentCompose";
import CommentDialog from "ui/comment/CommentDialog";
import { getPageHeaderHeight } from "util/misc";
import "./Comments.css";

class Comments extends React.PureComponent {

    constructor(props, context) {
        super(props, context);

        this.newAnchor = null;
        this.topmostBeforeUpdate = null;

        this.state = {
            atTop: true,
            atBottom: false
        };
    }

    componentDidMount() {
        this.newAnchor = this.props.anchor;
        this.scrollToAnchor();
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        this.topmostBeforeUpdate = Comments.getTopmostMoment();
        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.anchor !== prevProps.anchor) {
            this.newAnchor = this.props.anchor;
        }
        if (this.props.visible) {
            const topmost = Comments.getTopmostMoment();
            if (this.topmostBeforeUpdate != null && this.topmostBeforeUpdate !== topmost) {
                Comments.scrollTo(this.topmostBeforeUpdate);
                this.topmostBeforeUpdate = null;
            }
            this.scrollToAnchor();
        }
    }

    scrollToAnchor() {
        if (this.props.focused) {
            Comments.scrollToElement(document.getElementById("comments"));
            this.props.commentsScrolledToComments();
            return;
        }
        if (this.props.composerFocused) {
            Comments.scrollToElement(document.getElementById("comment-composer"));
            const body = document.getElementById("body");
            if (body != null) {
                body.focus();
            }
            this.props.commentsScrolledToComposer();
            return;
        }
        if (this.newAnchor != null
            && (this.newAnchor <= this.props.before
                || (this.newAnchor >= Number.MAX_SAFE_INTEGER && this.props.before >= Number.MAX_SAFE_INTEGER))
            && (this.newAnchor > this.props.after
                || (this.newAnchor <= Number.MIN_SAFE_INTEGER && this.props.after <= Number.MIN_SAFE_INTEGER))) {

            if (Comments.scrollTo(this.newAnchor)) {
                this.newAnchor = null;
                this.props.commentsScrolledToAnchor();
            }
        }
    }

    static getTopmostMoment() {
        const comments = document.getElementsByClassName("comment");
        if (comments.length === 0) {
            return null;
        }
        for (let i = 0; i < comments.length; i++) {
            if (comments.item(i).getBoundingClientRect().top >= 0) {
                return parseInt(comments.item(i).dataset.moment);
            }
        }
        return Number.MAX_SAFE_INTEGER;
    }

    static getCommentAt(moment) {
        const comments = document.getElementsByClassName("comment");
        for (let i = 0; i < comments.length; i++) {
            if (comments.item(i).dataset.moment >= moment) {
                return comments.item(i);
            }
        }
        return null;
    }

    static scrollTo(moment) {
        if (moment === Number.MAX_SAFE_INTEGER) {
            Comments.scrollToEnd();
            return true;
        } else {
            const comment = Comments.getCommentAt(moment);
            if (comment != null) {
                Comments.scrollToElement(comment);
            }
            return comment != null;
        }
    }

    static scrollToEnd() {
        const y = document.getElementById("comments").getBoundingClientRect().bottom;
        window.scrollBy(0, y - getPageHeaderHeight());
    }

    static scrollToElement(element) {
        const y = element.getBoundingClientRect().top;
        window.scrollBy(0, y - getPageHeaderHeight());
    }

    loadFuture = () => {
        if (this.props.loadingFuture || this.props.before >= Number.MAX_SAFE_INTEGER) {
            return;
        }
        this.props.commentsFutureSliceLoad();
    }

    loadPast = () => {
        if (this.props.loadingPast || this.props.after <= Number.MIN_SAFE_INTEGER) {
            return;
        }
        this.props.commentsPastSliceLoad();
    }

    onBoundaryFuture = intersecting => {
        this.setState({atTop: intersecting});
    };

    onBoundaryPast = intersecting => {
        this.setState({atBottom: intersecting});
    };

    render() {
        const {
            postingId, total, loadingFuture, loadingPast, comments, before, after, totalInPast, totalInFuture,
            focusedCommentId
        } = this.props;

        const empty = comments.length === 0 && !loadingFuture && !loadingPast
            && before >= Number.MAX_SAFE_INTEGER && after <= Number.MIN_SAFE_INTEGER;

        return (
            <>
                <div id="comments">
                    {empty ||
                        <>
                            {comments.length > 0 &&
                                <CommentsSentinelLine end={false} loading={loadingPast} title="View earlier comments"
                                                      total={totalInPast}
                                                      visible={total > 0 && after > Number.MIN_SAFE_INTEGER}
                                                      onBoundary={this.onBoundaryPast} onClick={this.loadPast}/>
                            }
                            {comments.map(comment =>
                                <Comment key={comment.moment} postingId={postingId} comment={comment}
                                         focused={comment.id === focusedCommentId} deleting={comment.deleting}/>
                            )}
                            <CommentsSentinelLine end={true} loading={loadingFuture}
                                                  title={comments.length !== 0 ? "View later comments" : "View comments"}
                                                  total={totalInFuture}
                                                  visible={total > 0 && before < Number.MAX_SAFE_INTEGER}
                                                  onBoundary={this.onBoundaryFuture} onClick={this.loadFuture}/>
                        </>
                    }
                </div>
                <CommentCompose/>
                <CommentDialog/>
            </>
        );
    }
}

export default connect(
    state => ({
        visible: isAtDetailedPostingPage(state),
        postingId: getDetailedPostingId(state),
        total: isDetailedPostingCached(state) ? getDetailedPosting(state).totalComments : 0,
        loadingFuture: getCommentsState(state).loadingFuture,
        loadingPast: getCommentsState(state).loadingPast,
        before: getCommentsState(state).before,
        after: getCommentsState(state).after,
        totalInPast: getCommentsState(state).totalInPast,
        totalInFuture: getCommentsState(state).totalInFuture,
        comments: getCommentsState(state).comments,
        anchor: getCommentsState(state).anchor,
        focusedCommentId: getCommentsState(state).focusedCommentId,
        focused: isCommentsFocused(state),
        composerFocused: isCommentComposerFocused(state)
    }),
    {
        commentsFutureSliceLoad, commentsPastSliceLoad, commentsScrolledToAnchor, commentsScrolledToComments,
        commentsScrolledToComposer
    }
)(Comments);
