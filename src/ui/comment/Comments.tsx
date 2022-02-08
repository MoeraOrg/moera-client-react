import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import {
    commentsFutureSliceLoad,
    commentsPastSliceLoad,
    commentsScrolledToAnchor,
    commentsScrolledToComments,
    commentsScrolledToComposer,
    detailedPostingScrolledToGallery
} from "state/detailedposting/actions";
import {
    getCommentsState,
    getDetailedPosting,
    getDetailedPostingId,
    isCommentComposerFocused,
    isCommentsFocused,
    isDetailedPostingCached, isDetailedPostingGalleryFocused
} from "state/detailedposting/selectors";
import { isAtDetailedPostingPage } from "state/navigation/selectors";
import CommentsSentinelLine from "ui/comment/CommentsSentinelLine";
import Comment from "ui/comment/Comment";
import CommentCompose from "ui/comment/CommentCompose";
import CommentDialog from "ui/comment/CommentDialog";
import { getPageHeaderHeight } from "util/misc";
import "./Comments.css";

type Props = ConnectedProps<typeof connector>;

interface State {
    atTop: boolean;
    atBottom: boolean;
}

class Comments extends React.PureComponent<Props, State> {

    newAnchor: number | null = null;
    topmostBeforeUpdate: number | null = null;

    constructor(props: Props, context: any) {
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

    getSnapshotBeforeUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
        this.topmostBeforeUpdate = Comments.getTopmostMoment();
        return null;
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
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
        if (this.props.galleryFocused) {
            Comments.scrollToElement(document.getElementById("posting-gallery")!);
            this.props.detailedPostingScrolledToGallery();
            return;
        }
        if (this.props.focused) {
            Comments.scrollToElement(document.getElementById("comments")!);
            this.props.commentsScrolledToComments();
            return;
        }
        if (this.props.composerFocused) {
            Comments.scrollToElement(document.getElementById("comment-composer")!);
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
        if (comments == null || comments.length === 0) {
            return null;
        }
        for (let i = 0; i < comments.length; i++) {
            const comment = comments.item(i) as HTMLElement;
            if (comment == null) {
                continue;
            }
            if (comment.getBoundingClientRect().top >= 0 && comment.dataset.moment) {
                return parseInt(comment.dataset.moment);
            }
        }
        return Number.MAX_SAFE_INTEGER;
    }

    static getCommentAt(moment: number): HTMLElement | null {
        const comments = document.getElementsByClassName("comment");
        for (let i = 0; i < comments.length; i++) {
            const comment = comments.item(i) as HTMLElement;
            if (comment == null) {
                continue;
            }
            if (comment.dataset.moment != null && parseInt(comment.dataset.moment) >= moment) {
                return comment;
            }
        }
        return null;
    }

    static scrollTo(moment: number): boolean {
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

    static scrollToEnd(): void {
        setTimeout(() => {
            const y = document.getElementById("comments")!.getBoundingClientRect().bottom;
            window.scrollBy(0, y - getPageHeaderHeight());
        });
    }

    static scrollToElement(element: Element): void {
        setTimeout(() => {
            const y = element.getBoundingClientRect().top;
            window.scrollBy(0, y - getPageHeaderHeight());
        });
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

    onBoundaryFuture = (intersecting: boolean) => {
        this.setState({atTop: intersecting});
    };

    onBoundaryPast = (intersecting: boolean) => {
        this.setState({atBottom: intersecting});
    };

    render() {
        const {
            postingId, total, loadingFuture, loadingPast, comments, before, after, totalInPast, totalInFuture,
            focusedCommentId
        } = this.props;

        if (postingId == null) {
            return null;
        }

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
                            {comments.map((comment, index) =>
                                <Comment key={comment.moment} postingId={postingId} comment={comment}
                                         previousId={index > 0 ? comments[index - 1].id : null}
                                         focused={comment.id === focusedCommentId}/>
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

const connector = connect(
    (state: ClientState) => ({
        visible: isAtDetailedPostingPage(state),
        postingId: getDetailedPostingId(state),
        galleryFocused: isDetailedPostingGalleryFocused(state),
        total: isDetailedPostingCached(state) ? (getDetailedPosting(state)!.totalComments ?? 0) : 0,
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
        detailedPostingScrolledToGallery, commentsFutureSliceLoad, commentsPastSliceLoad, commentsScrolledToAnchor,
        commentsScrolledToComments, commentsScrolledToComposer
    }
);

export default connector(Comments);
