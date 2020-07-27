import React from 'react';
import { connect } from 'react-redux';

import {
    commentsFutureSliceLoad,
    commentsPastSliceLoad,
    commentsScrolledToAnchor
} from "state/detailedposting/actions";
import { getCommentsState } from "state/detailedposting/selectors";
import { isAtDetailedPostingPage } from "state/navigation/selectors";
import CommentsSentinel from "ui/comment/CommentsSentinel";
import Comment from "ui/comment/Comment";
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
            if (comments.item(i).dataset.moment <= moment) {
                return comments.item(i);
            }
        }
        return null;
    }

    static getEarliestComment() {
        const comments = document.getElementsByClassName("comment");
        return comments.length > 0 ? comments.item(comments.length - 1) : null;
    }

    static scrollTo(moment) {
        const comment = moment > Number.MIN_SAFE_INTEGER ?
            Comments.getCommentAt(moment) : Comments.getEarliestComment();
        if (comment != null) {
            const y = comment.getBoundingClientRect().top;
            window.scrollBy(0, y - 10);
        }
        return comment != null;
    }

    loadFuture = () => {
        if (this.props.loadingFuture || this.props.before >= Number.MAX_SAFE_INTEGER) {
            return;
        }
        this.props.commentsFutureSliceLoad(this.props.postingId);
    }

    loadPast = () => {
        if (this.props.loadingPast || this.props.after <= Number.MIN_SAFE_INTEGER) {
            return;
        }
        this.props.commentsPastSliceLoad(this.props.postingId);
    }

    onBoundaryFuture = intersecting => {
        this.setState({atTop: intersecting});
    };

    onBoundaryPast = intersecting => {
        this.setState({atBottom: intersecting});
    };

    render() {
        const {loadingFuture, loadingPast, comments, before, after} = this.props;

        if (comments.length === 0 && !loadingFuture && !loadingPast
            && before >= Number.MAX_SAFE_INTEGER && after <= Number.MIN_SAFE_INTEGER) {

            return null;
        }

        return (
            <div className="comments">
                <CommentsSentinel loading={loadingPast} title="View earlier comments"
                                  visible={after > Number.MIN_SAFE_INTEGER} onBoundary={this.onBoundaryPast}
                                  onClick={this.loadPast}/>
                {comments.map(comment =>
                        <Comment key={comment.moment} comment={comment} deleting={comment.deleting}/>)}
                <CommentsSentinel loading={loadingFuture} title="View later comments"
                                  visible={before < Number.MAX_SAFE_INTEGER} onBoundary={this.onBoundaryFuture}
                                  onClick={this.loadFuture}/>
            </div>
        );
    }
}

export default connect(
    state => ({
        visible: isAtDetailedPostingPage(state),
        loadingFuture: getCommentsState(state).loadingFuture,
        loadingPast: getCommentsState(state).loadingPast,
        before: getCommentsState(state).before,
        after: getCommentsState(state).after,
        comments: getCommentsState(state).comments,
        anchor: getCommentsState(state).anchor
    }),
    { commentsFutureSliceLoad, commentsPastSliceLoad, commentsScrolledToAnchor }
)(Comments);