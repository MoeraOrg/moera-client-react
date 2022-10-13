import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import debounce from 'lodash.debounce';
import { WithTranslation, withTranslation } from 'react-i18next';

import FeedTitle from "ui/feed/FeedTitle";
import FeedPageHeader from "ui/feed/FeedPageHeader";
import { Page } from "ui/page/Page";
import FeedPosting from "ui/feed/FeedPosting";
import FeedSentinel from "ui/feed/FeedSentinel";
import { ClientState } from "state/state";
import { getFeedState } from "state/feeds/selectors";
import {
    feedFutureSliceLoad,
    feedPastSliceLoad,
    feedScrolled,
    feedScrolledToAnchor,
    feedStatusUpdate
} from "state/feeds/actions";
import { isAtHomeNode } from "state/node/selectors";
import { getPageHeaderHeight } from "util/misc";
import "./FeedPage.css";

function postingMoment(posting: HTMLElement): number {
    return posting.dataset.moment != null ? parseInt(posting.dataset.moment) : 0;
}

interface OwnProps {
    feedName: string;
    visible: boolean;
    title: string;
    shareable?: boolean;
}

type Props = OwnProps & ConnectedProps<typeof connector> & WithTranslation;

interface State {
    atTop: boolean;
    atBottom: boolean;
    scrolled: boolean;
    topmostMoment: number;
}

class FeedPage extends React.PureComponent<Props, State> {

    mounted: boolean;
    prevAt: number;
    newAnchor: number | null;
    topmostBeforeUpdate: number | null;
    futureIntersecting: boolean;
    pastIntersecting: boolean;

    constructor(props: Props, context: any) {
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
            scrolled: false,
            topmostMoment: Number.MAX_SAFE_INTEGER
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

    getSnapshotBeforeUpdate() {
        this.topmostBeforeUpdate = FeedPage.getTopmostMoment();
        return null;
    }

    componentDidUpdate(prevProps: Readonly<Props>) {
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
        this.setState({scrolled: window.scrollY > 5, topmostMoment: FeedPage.getTopmostMoment()});
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

    static getTopmostMoment() {
        const top = getPageHeaderHeight();
        const postings = document.getElementsByClassName("posting");
        for (let i = 0; i < postings.length; i++) {
            const posting = postings.item(i) as HTMLElement;
            if (posting == null) {
                continue;
            }
            if (posting.getBoundingClientRect().top >= top) {
                return postingMoment(posting);
            }
        }
        return Number.MAX_SAFE_INTEGER;
    }

    static getPostingAt(moment: number) {
        const postings = document.getElementsByClassName("posting");
        for (let i = 0; i < postings.length; i++) {
            const posting = postings.item(i) as HTMLElement;
            if (posting == null) {
                continue;
            }
            if (postingMoment(posting) <= moment) {
                return posting;
            }
        }
        return null;
    }

    static getEarliestPosting() {
        const postings = document.getElementsByClassName("posting");
        return postings.length > 0 ? postings.item(postings.length - 1) : null;
    }

    static getNotViewedMoment() {
        const top = getPageHeaderHeight();
        const postings = document.getElementsByClassName("posting");
        for (let i = 0; i < postings.length; i++) {
            const posting = postings.item(i) as HTMLElement;
            if (posting == null) {
                continue;
            }
            if (posting.getBoundingClientRect().top >= top && posting.dataset.viewed === "false") {
                return postingMoment(posting);
            }
        }
        return null;
    }

    static markAllViewed() {
        const top = getPageHeaderHeight();
        const postings = document.getElementsByClassName("posting");
        for (let i = 0; i < postings.length; i++) {
            const posting = postings.item(i) as HTMLElement;
            if (posting == null) {
                continue;
            }
            if (posting.getBoundingClientRect().top >= top) {
                posting.dataset.viewed = "true";
                posting.classList.remove("not-viewed");
            }
        }
    }

    static scrollTo(moment: number) {
        const posting = moment > Number.MIN_SAFE_INTEGER ?
            FeedPage.getPostingAt(moment) : FeedPage.getEarliestPosting();
        if (posting == null) {
            return false;
        }
        setTimeout(() => {
            const y = posting.getBoundingClientRect().top;
            const minY = getPageHeaderHeight() + 10;
            window.scrollBy(0, y - minY - 25);
        });
        return true;
    }

    onSentinelFuture = (intersecting: boolean) => {
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

    onSentinelPast = (intersecting: boolean) => {
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

    onBoundaryFuture = (intersecting: boolean) => {
        this.setState({atTop: intersecting});
    };

    onBoundaryPast = (intersecting: boolean) => {
        this.setState({atBottom: intersecting});
    };

    getTotalAfterTop(): number {
        const {stories, totalInFuture, totalPinned} = this.props;
        const {topmostMoment} = this.state;

        if (topmostMoment >= Number.MAX_SAFE_INTEGER) {
            return 0;
        }
        const afterTop = stories.filter(story => story.moment > topmostMoment).length;
        const total = afterTop + totalInFuture - totalPinned;

        return total > 0 ? total : 0;
    }

    render() {
        const {
            feedName, title, shareable, loadingFuture, loadingPast, stories, notViewed, notViewedMoment, postings,
            before, after, t
        } = this.props;
        const {atTop, atBottom} = this.state;

        if (stories.length === 0 && !loadingFuture && !loadingPast
            && before >= Number.MAX_SAFE_INTEGER && after <= Number.MIN_SAFE_INTEGER) {

            return (
                <>
                    <FeedTitle/>
                    <FeedPageHeader feedName={feedName} title={title} empty atTop={true} atBottom={true}
                                    totalAfterTop={0} notViewed={0} notViewedMoment={null}/>
                    <div className="no-postings">{t("nothing-yet")}</div>
                </>
            );
        }

        return (
            <>
                <FeedTitle/>
                <FeedPageHeader feedName={feedName} title={title} shareable={shareable}
                                atTop={atTop && before >= Number.MAX_SAFE_INTEGER}
                                atBottom={atBottom && after <= Number.MIN_SAFE_INTEGER}
                                totalAfterTop={this.getTotalAfterTop()}
                                notViewed={notViewed ?? 0} notViewedMoment={notViewedMoment ?? null}/>
                <Page>
                    <FeedSentinel loading={loadingFuture} title={t("load-newer-posts")} margin="250px 0px 0px 0px"
                                  visible={before < Number.MAX_SAFE_INTEGER} onSentinel={this.onSentinelFuture}
                                  onBoundary={this.onBoundaryFuture} onClick={this.loadFuture}/>
                    {stories
                        .filter(t => t.postingId != null)
                        .filter(t => postings[t.postingId!])
                        .map(t => ({story: t, ...postings[t.postingId!]!}))
                        .map(({story, posting, deleting}) =>
                            <FeedPosting key={story.moment} posting={posting} story={story} deleting={deleting}/>)}
                    <FeedSentinel loading={loadingPast} title={t("load-older-posts")} margin="0px 0px 250px 0px"
                                  visible={after > Number.MIN_SAFE_INTEGER} onSentinel={this.onSentinelPast}
                                  onBoundary={this.onBoundaryPast} onClick={this.loadPast}/>
                    {after <= Number.MIN_SAFE_INTEGER
                        && <div className="feed-end">&mdash; {t("reached-bottom")} &mdash;</div>}
                </Page>
            </>
        );
    }
}

const connector = connect(
    (state: ClientState, ownProps: OwnProps) => ({
        loadingFuture: getFeedState(state, ownProps.feedName).loadingFuture,
        loadingPast: getFeedState(state, ownProps.feedName).loadingPast,
        before: getFeedState(state, ownProps.feedName).before,
        after: getFeedState(state, ownProps.feedName).after,
        stories: getFeedState(state, ownProps.feedName).stories,
        totalInFuture: getFeedState(state, ownProps.feedName).totalInFuture,
        totalPinned: getFeedState(state, ownProps.feedName).status.totalPinned,
        notViewed: getFeedState(state, ownProps.feedName).status.notViewed,
        notViewedMoment: getFeedState(state, ownProps.feedName).status.notViewedMoment,
        postings: state.postings[""] ?? {},
        anchor: getFeedState(state, ownProps.feedName).anchor,
        atHomeNode: isAtHomeNode(state)
    }),
    { feedFutureSliceLoad, feedPastSliceLoad, feedScrolled, feedScrolledToAnchor, feedStatusUpdate }
);

export default connector(withTranslation()(FeedPage));
