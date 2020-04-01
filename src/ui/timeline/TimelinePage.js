import React from 'react';
import { connect } from 'react-redux';

import { Page } from "ui/page/Page";
import TimelinePageHeader from "ui/timeline/TimelinePageHeader";
import TimelinePosting from "ui/timeline/TimelinePosting";
import TimelineSentinel from "ui/timeline/TimelineSentinel";
import {
    timelineFutureSliceLoad,
    timelinePastSliceLoad,
    timelineScrolled,
    timelineScrolledToAnchor
} from "state/timeline/actions";
import { isAtTimelinePage } from "state/navigation/selectors";

import "./TimelinePage.css";

class TimelinePage extends React.PureComponent {

    constructor(props, context) {
        super(props, context);

        this.prevAt = Number.MAX_SAFE_INTEGER;
        this.newAnchor = null;
        this.topmostBeforeUpdate = null;

        this.updateOnScrollHandler();

        this.futureIntersecting = true;
        this.pastIntersecting = true;
    }

    componentDidMount() {
        this.newAnchor = this.props.anchor;
        this.scrollToAnchor();
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        this.topmostBeforeUpdate = TimelinePage.getTopmostMoment();
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
            const topmost = TimelinePage.getTopmostMoment();
            if (this.topmostBeforeUpdate != null && this.topmostBeforeUpdate !== topmost) {
                TimelinePage.scrollTo(this.topmostBeforeUpdate);
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

            if (TimelinePage.scrollTo(this.newAnchor)) {
                this.newAnchor = null;
                this.props.timelineScrolledToAnchor();
            }
        }
    }

    updateOnScrollHandler() {
        window.onscroll = this.props.visible ? this.onScroll : null;
    }

    onScroll = () => {
        const at = TimelinePage.getTopmostMoment();
        if (at !== this.prevAt) {
            this.props.timelineScrolled(at);
        }
        this.prevAt = at;

    };

    static getHeaderHeight() {
        const mainMenu = document.getElementById("main-menu");
        const header = document.getElementById("timeline-header");
        return mainMenu != null && header != null
            ? mainMenu.getBoundingClientRect().height + header.getBoundingClientRect().height : 0;
    }

    static getTopmostMoment() {
        const top = TimelinePage.getHeaderHeight();
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
            TimelinePage.getPostingAt(moment) : TimelinePage.getEarliestPosting();
        if (posting != null) {
            const y = posting.getBoundingClientRect().top;
            const minY = TimelinePage.getHeaderHeight() + 10;
            window.scrollBy(0, y - minY);
        }
        return posting != null;
    }

    onSentinelFuture = entry => {
        this.futureIntersecting = entry[0].isIntersecting;
        if (this.futureIntersecting) {
            this.loadFuture();
        }
    };

    loadFuture() {
        if (this.props.loadingFuture || this.props.before >= Number.MAX_SAFE_INTEGER) {
            return;
        }
        this.props.timelineFutureSliceLoad();
    }

    onSentinelPast = entry => {
        this.pastIntersecting = entry[0].isIntersecting;
        if (this.pastIntersecting) {
            this.loadPast();
        }
    };

    loadPast() {
        if (this.props.loadingPast || this.props.after <= Number.MIN_SAFE_INTEGER) {
            return;
        }
        this.props.timelinePastSliceLoad();
    }

    render() {
        const {loadingFuture, loadingPast, timeline, postings, before, after} = this.props;

        if (timeline.length === 0 && !loadingFuture && !loadingPast
            && before >= Number.MAX_SAFE_INTEGER && after <= Number.MIN_SAFE_INTEGER) {

            return (
                <Page>
                    <TimelinePageHeader empty />
                    <div className="no-postings">Nothing yet.</div>
                </Page>
            );
        }

        return (
            <Page>
                <TimelinePageHeader />
                <TimelineSentinel loading={loadingFuture} title="Load newer posts" margin="250px 0px 0px 0px"
                                  visible={before < Number.MAX_SAFE_INTEGER} onSentinel={this.onSentinelFuture}
                                  onClick={() => this.loadFuture()}/>
                {timeline
                    .filter(t => postings[t.id])
                    .map(t => ({moment: t.moment, ...postings[t.id]}))
                    .map(({moment, posting, deleting}) =>
                        <TimelinePosting key={moment} posting={posting} moment={moment} deleting={deleting}/>)}
                <TimelineSentinel loading={loadingPast} title="Load older posts" margin="0px 0px 250px 0px"
                                  visible={after > Number.MIN_SAFE_INTEGER} onSentinel={this.onSentinelPast}
                                  onClick={() => this.loadPast()}/>
                {after <= Number.MIN_SAFE_INTEGER
                    && <div className="timeline-end">&mdash; You've reached the bottom &mdash;</div>}
            </Page>
        );
    }
}

export default connect(
    state => ({
        visible: isAtTimelinePage(state),
        loadingFuture: state.timeline.loadingFuture,
        loadingPast: state.timeline.loadingPast,
        before: state.timeline.before,
        after: state.timeline.after,
        timeline: state.timeline.stories,
        postings: state.postings,
        anchor: state.timeline.anchor
    }),
    { timelineFutureSliceLoad, timelinePastSliceLoad, timelineScrolled, timelineScrolledToAnchor }
)(TimelinePage);
