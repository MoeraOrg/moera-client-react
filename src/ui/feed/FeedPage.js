import React from 'react';
import { connect } from 'react-redux';

import FeedPageHeader from "ui/feed/FeedPageHeader";
import FeedPosting from "ui/feed/FeedPosting";
import FeedSentinel from "ui/feed/FeedSentinel";
import { getFeedState } from "state/feeds/selectors";
import { feedFutureSliceLoad, feedPastSliceLoad, feedScrolled, feedScrolledToAnchor } from "state/feeds/actions";
import "./FeedPage.css";

class FeedPage extends React.PureComponent {

    constructor(props, context) {
        super(props, context);

        this.prevAt = Number.MAX_SAFE_INTEGER;
        this.newAnchor = null;
        this.topmostBeforeUpdate = null;

        this.updateOnScrollHandler();

        this.futureIntersecting = true;
        this.pastIntersecting = true;
        this.state = {
            atTop: true,
            atBottom: false,
            scrolled: false
        };
    }

    componentDidMount() {
        this.newAnchor = this.props.anchor;
        this.scrollToAnchor();
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        this.topmostBeforeUpdate = FeedPage.getTopmostMoment();
        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.anchor !== prevProps.anchor) {
            this.newAnchor = this.props.anchor;
        }
        if (this.props.visible !== prevProps.visible) {
            this.updateOnScrollHandler();
        }
        if (this.props.visible) {
            if (this.props.before !== prevProps.before && this.futureIntersecting) {
                this.loadFuture();
            }
            if (this.props.after !== prevProps.after && this.pastIntersecting) {
                this.loadPast();
            }
            const topmost = FeedPage.getTopmostMoment();
            if (this.topmostBeforeUpdate != null && this.topmostBeforeUpdate !== topmost) {
                FeedPage.scrollTo(this.topmostBeforeUpdate);
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

            if (FeedPage.scrollTo(this.newAnchor)) {
                this.newAnchor = null;
                this.props.feedScrolledToAnchor(this.props.feedName);
            }
        }
    }

    updateOnScrollHandler() {
        window.onscroll = this.props.visible ? this.onScroll : null;
    }

    onScroll = () => {
        const at = FeedPage.getTopmostMoment();
        if (at !== this.prevAt) {
            this.props.feedScrolled(this.props.feedName, at);
        }
        this.prevAt = at;
        this.setState({scrolled: window.scrollY > 5});
    };

    static getHeaderHeight() {
        const mainMenu = document.getElementById("main-menu");
        const header = document.getElementById("feed-header");
        return mainMenu != null && header != null
            ? mainMenu.getBoundingClientRect().height + header.getBoundingClientRect().height : 0;
    }

    static getTopmostMoment() {
        const top = FeedPage.getHeaderHeight();
        const postings = document.getElementsByClassName("posting");
        for (let i = 0; i < postings.length; i++) {
            if (postings.item(i).getBoundingClientRect().top >= top) {
                return parseInt(postings.item(i).dataset.moment);
            }
        }
        return Number.MAX_SAFE_INTEGER;
    }

    static getPostingAt(moment) {
        const postings = document.getElementsByClassName("posting");
        for (let i = 0; i < postings.length; i++) {
            if (postings.item(i).dataset.moment <= moment) {
                return postings.item(i);
            }
        }
        return null;
    }

    static getEarliestPosting() {
        const postings = document.getElementsByClassName("posting");
        return postings.length > 0 ? postings.item(postings.length - 1) : null;
    }

    static scrollTo(moment) {
        const posting = moment > Number.MIN_SAFE_INTEGER ?
            FeedPage.getPostingAt(moment) : FeedPage.getEarliestPosting();
        if (posting != null) {
            const y = posting.getBoundingClientRect().top;
            const minY = FeedPage.getHeaderHeight() + 10;
            window.scrollBy(0, y - minY);
        }
        return posting != null;
    }

    onSentinelFuture = intersecting => {
        this.futureIntersecting = intersecting;
        if (this.futureIntersecting) {
            this.loadFuture();
        }
    };

    loadFuture = () => {
        if (this.props.loadingFuture || this.props.before >= Number.MAX_SAFE_INTEGER) {
            return;
        }
        this.props.feedFutureSliceLoad(this.props.feedName);
    }

    onSentinelPast = intersecting => {
        this.pastIntersecting = intersecting;
        if (this.pastIntersecting) {
            this.loadPast();
        }
    };

    loadPast = () => {
        if (this.props.loadingPast || this.props.after <= Number.MIN_SAFE_INTEGER) {
            return;
        }
        this.props.feedPastSliceLoad(this.props.feedName);
    }

    onBoundaryFuture = intersecting => {
        this.setState({atTop: intersecting});
    };

    onBoundaryPast = intersecting => {
        this.setState({atBottom: intersecting});
    };

    render() {
        const {feedName, title, loadingFuture, loadingPast, stories, postings, before, after} = this.props;
        const {atTop, atBottom, scrolled} = this.state;

        if (stories.length === 0 && !loadingFuture && !loadingPast
            && before >= Number.MAX_SAFE_INTEGER && after <= Number.MIN_SAFE_INTEGER) {

            return (
                <>
                    <FeedPageHeader feedName={feedName} title={title} empty/>
                    <div className="no-postings">Nothing yet.</div>
                </>
            );
        }

        return (
            <>
                <FeedPageHeader feedName={feedName} title={title} scrolled={scrolled}
                                atTop={atTop && before >= Number.MAX_SAFE_INTEGER}
                                atBottom={atBottom && after <= Number.MIN_SAFE_INTEGER}/>
                <FeedSentinel loading={loadingFuture} title="Load newer posts" margin="250px 0px 0px 0px"
                              visible={before < Number.MAX_SAFE_INTEGER} onSentinel={this.onSentinelFuture}
                              onBoundary={this.onBoundaryFuture} onClick={this.loadFuture}/>
                {stories
                    .filter(t => postings[t.postingId])
                    .map(t => ({story: t, ...postings[t.postingId]}))
                    .map(({story, posting, deleting}) =>
                        <FeedPosting key={story.moment} posting={posting} story={story} deleting={deleting}/>)}
                <FeedSentinel loading={loadingPast} title="Load older posts" margin="0px 0px 250px 0px"
                              visible={after > Number.MIN_SAFE_INTEGER} onSentinel={this.onSentinelPast}
                              onBoundary={this.onBoundaryPast} onClick={this.loadPast}/>
                {after <= Number.MIN_SAFE_INTEGER
                    && <div className="feed-end">&mdash; You've reached the bottom &mdash;</div>}
            </>
        );
    }
}

export default connect(
    (state, ownProps) => ({
        loadingFuture: getFeedState(state, ownProps.feedName).loadingFuture,
        loadingPast: getFeedState(state, ownProps.feedName).loadingPast,
        before: getFeedState(state, ownProps.feedName).before,
        after: getFeedState(state, ownProps.feedName).after,
        stories: getFeedState(state, ownProps.feedName).stories,
        postings: state.postings,
        anchor: getFeedState(state, ownProps.feedName).anchor
    }),
    { feedFutureSliceLoad, feedPastSliceLoad, feedScrolled, feedScrolledToAnchor }
)(FeedPage);
