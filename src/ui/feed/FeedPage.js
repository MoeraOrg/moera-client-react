import React from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';

import FeedTitle from "ui/feed/FeedTitle";
import FeedPageHeader from "ui/feed/FeedPageHeader";
import { Page } from "ui/page/Page";
import FeedPosting from "ui/feed/FeedPosting";
import FeedSentinel from "ui/feed/FeedSentinel";
import { getFeedState } from "state/feeds/selectors";
import {
    feedFutureSliceLoad,
    feedPastSliceLoad,
    feedScrolled,
    feedScrolledToAnchor,
    feedStatusUpdate
} from "state/feeds/actions";
import { isAtHomeNode } from "state/node/selectors";
import "./FeedPage.css";

class FeedPage extends React.PureComponent {

    constructor(props, context) {
        super(props, context);

        this.mounted = false;
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
        this.mounted = true;
        this.updateOnScrollHandler();
        this.newAnchor = this.props.anchor;
        this.scrollToAnchor();
    }

    componentWillUnmount() {
        this.mounted = false;
        this.updateOnScrollHandler();
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
            this.onView();
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
        window.onscroll = this.mounted && this.props.visible ? this.onScroll : null;
    }

    onScroll = () => {
        this.updateAtMoment();
        this.setState({scrolled: window.scrollY > 5});
        this.onView();
    };

    updateAtMoment = debounce(() => {
        const at = FeedPage.getTopmostMoment();
        if (at !== this.prevAt) {
            this.props.feedScrolled(this.props.feedName, at);
        }
        this.prevAt = at;
    }, 500);

    onView = debounce(() => {
        const {feedName, atHomeNode, feedStatusUpdate} = this.props;

        if (!atHomeNode) {
            return;
        }
        const moment = FeedPage.getNotViewedMoment();
        if (moment != null) {
            FeedPage.markAllViewed();
            feedStatusUpdate(":" + feedName, true, null, moment);
        }
    }, 1000);

    static getHeaderHeight() {
        const mainMenu = document.getElementById("main-menu");
        const header = document.getElementById("page-header");
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

    static getNotViewedMoment() {
        const top = FeedPage.getHeaderHeight();
        const postings = document.getElementsByClassName("posting");
        for (let i = 0; i < postings.length; i++) {
            if (postings.item(i).getBoundingClientRect().top >= top && postings.item(i).dataset.viewed === "false") {
                return parseInt(postings.item(i).dataset.moment);
            }
        }
        return null;
    }

    static markAllViewed() {
        const top = FeedPage.getHeaderHeight();
        const postings = document.getElementsByClassName("posting");
        for (let i = 0; i < postings.length; i++) {
            if (postings.item(i).getBoundingClientRect().top >= top) {
                postings.item(i).dataset.viewed = "true";
            }
        }
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
        const {atTop, atBottom} = this.state;

        if (stories.length === 0 && !loadingFuture && !loadingPast
            && before >= Number.MAX_SAFE_INTEGER && after <= Number.MIN_SAFE_INTEGER) {

            return (
                <>
                    <FeedPageHeader feedName={feedName} title={title} empty atTop={true} atBottom={true}/>
                    <div className="no-postings">Nothing yet.</div>
                </>
            );
        }

        return (
            <>
                <FeedTitle/>
                <FeedPageHeader feedName={feedName} title={title}
                                atTop={atTop && before >= Number.MAX_SAFE_INTEGER}
                                atBottom={atBottom && after <= Number.MIN_SAFE_INTEGER}/>
                <Page>
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
                </Page>
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
        anchor: getFeedState(state, ownProps.feedName).anchor,
        atHomeNode: isAtHomeNode(state)
    }),
    { feedFutureSliceLoad, feedPastSliceLoad, feedScrolled, feedScrolledToAnchor, feedStatusUpdate }
)(FeedPage);
