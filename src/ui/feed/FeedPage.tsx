import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useTranslation } from 'react-i18next';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { ClientState } from "state/state";
import { getOwnerNameOrUrl, isAtHomeNode, isGooglePlayHiding } from "state/node/selectors";
import {
    feedFutureSliceLoad,
    feedPastSliceLoad,
    feedScrolled,
    feedScrolledToAnchor,
    feedStatusUpdate
} from "state/feeds/actions";
import { getFeedState } from "state/feeds/selectors";
import { PostingState } from "state/postings/state";
import { isPostingSheriffProhibited } from "state/postings/selectors";
import { useDebounce, useDispatcher } from "ui/hook";
import { FeedTopBox } from "ui/control";
import FeedTopButton from "ui/feed/FeedTopButton";
import FeedSkipPinnedButton from "ui/feed/FeedSkipPinnedButton";
import FeedStory from "ui/feed/FeedStory";
import FeedSentinel from "ui/feed/FeedSentinel";
import FeedNoContent from "ui/feed/nocontent/FeedNoContent";
import { usePostingVisited } from "ui/posting/posting-visited";
import { REL_HOME, RelNodeName } from "util/rel-node-name";
import { getPageHeaderHeight } from "util/ui";
import "./FeedPage.css";

type NavigationUpdateHandler = (navigable: boolean, atBottom: boolean) => void;

interface Props {
    nodeName: RelNodeName | string;
    feedName: string;
    visible: boolean;
    onNavigationUpdate?: NavigationUpdateHandler;
}

export default function FeedPage({nodeName, feedName, visible, onNavigationUpdate}: Props) {
    const loadingFuture = useSelector((state: ClientState) => getFeedState(state, nodeName, feedName).loadingFuture);
    const loadingPast = useSelector((state: ClientState) => getFeedState(state, nodeName, feedName).loadingPast);
    const before = useSelector((state: ClientState) => getFeedState(state, nodeName, feedName).before);
    const after = useSelector((state: ClientState) => getFeedState(state, nodeName, feedName).after);
    const stories = useSelector((state: ClientState) => getStories(state, nodeName, feedName));
    const totalInFuture = useSelector((state: ClientState) => getFeedState(state, nodeName, feedName).totalInFuture);
    const totalPinned = useSelector((state: ClientState) => getFeedState(state, nodeName, feedName).status.totalPinned);
    const notViewed = useSelector((state: ClientState) => getFeedState(state, nodeName, feedName).status.notViewed);
    const notViewedMoment = useSelector((state: ClientState) =>
        getFeedState(state, nodeName, feedName).status.notViewedMoment
    );
    const anchor = useSelector((state: ClientState) => getFeedState(state, nodeName, feedName).anchor);
    const atHomeNode = useSelector(isAtHomeNode);
    const dispatch = useDispatcher();

    const [atTop, setAtTop] = useState<boolean>(true);
    const [atBottom, setAtBottom] = useState<boolean>(false);
    const [topmostMoment, setTopmostMoment] = useState<number>(Number.MAX_SAFE_INTEGER);
    const feedRef = useRef<HTMLDivElement>(null);
    const scrollPosition = useRef<{element: HTMLElement; top: number; scrollY: number} | null>(null);

    const {t} = useTranslation();

    const rememberScrollPosition = useCallback((posting?: HTMLElement) => {
        const moment = getTopmostMoment(feedRef.current);
        const element = posting ?? getPostingAt(feedRef.current, moment);
        scrollPosition.current = element != null
            ? {element, top: element.getBoundingClientRect().top, scrollY: window.scrollY}
            : null;
        return moment;
    }, []);

    const restoreScrollPosition = useCallback((prepended = false) => {
        const position = scrollPosition.current;
        if (
            position == null || !position.element.isConnected || position.scrollY !== window.scrollY
            || (!prepended && window.scrollY === 0)
        ) {
            // Adopt pending scrolling, and keep the page top fixed while its initial content appears.
            rememberScrollPosition();
            return;
        }
        let delta = position.element.getBoundingClientRect().top - position.top;
        if (prepended && window.scrollY === 0) {
            delta -= 25;
        }
        if (delta !== 0) {
            window.scrollBy(0, delta);
        }
        scrollPosition.current = {
            element: position.element,
            top: position.element.getBoundingClientRect().top,
            scrollY: window.scrollY
        };
    }, [rememberScrollPosition]);

    const onScroll = useCallback(() => {
        // A queued event from our own correction must not discard a later layout change.
        if (scrollPosition.current?.scrollY === window.scrollY) {
            restoreScrollPosition();
            setTopmostMoment(getTopmostMoment(feedRef.current));
        } else {
            setTopmostMoment(rememberScrollPosition());
        }
    }, [rememberScrollPosition, restoreScrollPosition]);

    const onClickCapture = useCallback((event: React.MouseEvent) => {
        if (event.target instanceof Element) {
            const posting = event.target.closest<HTMLElement>(".posting:not(.linked-posting)");
            if (posting != null && feedRef.current?.contains(posting)) {
                // Expanding a posting must keep the clicked content in view, not pin the next posting below it.
                rememberScrollPosition(posting);
            }
        }
    }, [rememberScrollPosition]);

    const beginning = stories.length > 0 ? stories[0].story.moment : null;
    const prevBeginning = useRef<number | null>(null);
    const positionedAnchor = useRef<number | null>(null);

    const mostRecentMoment = before >= Number.MAX_SAFE_INTEGER
        ? beginning ?? Number.MAX_SAFE_INTEGER // we know what the last story in the feed is
        : Number.MAX_SAFE_INTEGER;             // we don't

    const scrollTo = useCallback((moment: number): void => {
        const posting = getPostingAt(feedRef.current, moment);
        if (posting != null) {
            if (moment >= mostRecentMoment) {
                window.scrollTo(0, 0);
                return;
            }

            const y = posting.getBoundingClientRect().top;
            const minY = getPageHeaderHeight() + 10;
            window.scrollBy(0, y - minY - 25);
        }
    }, [mostRecentMoment]);

    const positionFeed = useCallback(() => {
        if (!visible) {
            scrollPosition.current = null;
            return;
        }
        if (anchor != null && anchor !== positionedAnchor.current) {
            prevBeginning.current = beginning;
            const sanchor = toSafeRange(anchor);
            const sbefore = toSafeRange(before);
            const safter = toSafeRange(after);
            if (
                sbefore > safter
                && sanchor <= sbefore
                && ((sanchor > safter) || (sanchor === safter && safter === Number.MIN_SAFE_INTEGER))
            ) {
                const posting = getPostingAt(feedRef.current, sanchor);
                // Lazy stories may still be empty. ResizeObserver retries after their content appears.
                if (posting != null && posting.getBoundingClientRect().height > 0) {
                    scrollTo(sanchor);
                    setTopmostMoment(rememberScrollPosition(posting));
                    positionedAnchor.current = anchor;
                    dispatch(feedScrolledToAnchor(nodeName, feedName));
                }
            }
            return;
        }
        if (anchor == null) {
            positionedAnchor.current = null;
        }
        if (prevBeginning.current == null && beginning != null) {
            scrollTo(Number.MAX_SAFE_INTEGER);
            rememberScrollPosition();
        } else {
            restoreScrollPosition(beginning !== prevBeginning.current);
        }
        prevBeginning.current = beginning;
    }, [
        after, anchor, before, beginning, dispatch, feedName, nodeName, rememberScrollPosition,
        restoreScrollPosition, scrollTo, visible
    ]);

    // Compensate before refreshing the saved offset, even when the story list did not change.
    useLayoutEffect(() => {
        positionFeed();
    });

    useLayoutEffect(() => {
        const feed = feedRef.current;
        if (!visible || feed == null || typeof ResizeObserver === "undefined") {
            return;
        }
        let active = true;
        const observer = new ResizeObserver(() => {
            if (active) {
                positionFeed();
            }
        });
        observer.observe(feed);
        // Individual observations also catch offset changes when the total feed height stays the same.
        getPostingElements(feed).forEach(posting => observer.observe(posting));
        return () => {
            active = false;
            observer.disconnect();
        };
    }, [positionFeed, stories, visible]);

    const loadFuture = useCallback(() => {
        if (loadingFuture || before >= Number.MAX_SAFE_INTEGER) {
            return;
        }
        dispatch(feedFutureSliceLoad(nodeName, feedName));
    }, [before, dispatch, feedName, loadingFuture, nodeName]);

    const loadPast = useCallback(() => {
        if (loadingPast || after <= Number.MIN_SAFE_INTEGER) {
            return;
        }
        dispatch(feedPastSliceLoad(nodeName, feedName));
    }, [after, dispatch, feedName, loadingPast, nodeName]);

    useEffect(() => {
        if (visible) {
            window.addEventListener("scroll", onScroll);
        }
        return () => window.removeEventListener("scroll", onScroll);
    }, [onScroll, visible]);

    const [at] = useDebounce(topmostMoment, 500);
    useEffect(() => {
        dispatch(feedScrolled(nodeName, feedName, at));
    }, [at, dispatch, feedName, nodeName]);

    const [momentToVisit] = useDebounce(topmostMoment, 2000);
    const postingToVisit = useMemo(() => {
        if (!visible || momentToVisit >= Number.MAX_SAFE_INTEGER) {
            return null;
        }
        return stories.find(({story}) => story.moment === momentToVisit)?.posting;
    }, [momentToVisit, stories, visible]);
    usePostingVisited(nodeName, postingToVisit);

    const [momentToView] = useDebounce(getNotViewedMoment(feedRef.current), 1000);
    useEffect(() => {
        if (!atHomeNode) {
            return;
        }
        if (momentToView != null) {
            markAllViewed(feedRef.current);
            dispatch(feedStatusUpdate(REL_HOME, feedName, true, null, momentToView));
        }
    }, [atHomeNode, dispatch, feedName, momentToView]);

    const onSentinelFuture = (intersecting: boolean) => {
        if (intersecting) {
            loadFuture();
        }
    };

    const onSentinelPast = (intersecting: boolean) => {
        if (intersecting) {
            loadPast();
        }
    };

    const onBoundaryFuture = (intersecting: boolean) => setAtTop(intersecting);

    const onBoundaryPast = (intersecting: boolean) => setAtBottom(intersecting);

    useEffect(() => {
        if (onNavigationUpdate != null) {
            onNavigationUpdate(stories.length > 0, atBottom && after <= Number.MIN_SAFE_INTEGER);
        }
    }, [after, atBottom, onNavigationUpdate, stories.length]);

    const totalAfterTop = useMemo((): number => {
        if (topmostMoment >= Number.MAX_SAFE_INTEGER) {
            return 0;
        }
        const afterTop = stories.filter(({story}) => story.moment > topmostMoment).length;
        const total = afterTop + totalInFuture - totalPinned;

        return total > 0 ? total : 0;
    }, [stories, topmostMoment, totalInFuture, totalPinned]);

    const momentAbove = useMemo(() => getMomentAbove(feedRef.current, topmostMoment), [topmostMoment]);

    if (
        stories.length === 0 && !loadingFuture && !loadingPast
        && before >= Number.MAX_SAFE_INTEGER && after <= Number.MIN_SAFE_INTEGER
    ) {
        return (
            <FeedNoContent nodeName={nodeName} feedName={feedName}/>
        );
    }

    return (
        <div ref={feedRef} onClickCapture={onClickCapture}>
            <FeedTopBox>
                <FeedTopButton
                    nodeName={nodeName}
                    feedName={feedName}
                    atTop={atTop && before >= Number.MAX_SAFE_INTEGER}
                    totalAfterTop={totalAfterTop}
                    notViewed={notViewed ?? 0}
                    notViewedMoment={notViewedMoment ?? null}
                    momentAbove={momentAbove}
                />
                {(!atTop || before < Number.MAX_SAFE_INTEGER) &&
                    <FeedSkipPinnedButton nodeName={nodeName} feedName={feedName}/>
                }
            </FeedTopBox>
            <FeedSentinel
                loading={loadingFuture}
                margin="50% 0px 0px 0px"
                visible={before < Number.MAX_SAFE_INTEGER}
                onSentinel={onSentinelFuture}
                onBoundary={onBoundaryFuture}
                onClick={loadFuture}
            />
            {stories.map(({story, posting, deleting}) =>
                <FeedStory
                    key={story.moment}
                    nodeName={nodeName}
                    posting={posting ?? null}
                    feedName={feedName}
                    story={story}
                    deleting={deleting ?? false}
                />
            )}
            <FeedSentinel
                bottom
                loading={loadingPast}
                margin="0px 0px 50% 0px"
                visible={after > Number.MIN_SAFE_INTEGER}
                onSentinel={onSentinelPast}
                onBoundary={onBoundaryPast}
                onClick={loadPast}
            />
            {after <= Number.MIN_SAFE_INTEGER &&
                <>
                    <div className="feed-end">{t("reached-bottom")}</div>
                    <div className="feed-after-end"/>
                </>
            }
        </div>
    );
}

const EMPTY_MAP: Record<string, PostingState> = {};

const getStories = createSelector(
    (state: ClientState, nodeName: RelNodeName | string, feedName: string) =>
        getFeedState(state, nodeName, feedName).stories,
    (state: ClientState) => state.postings[getOwnerNameOrUrl(state)] ?? EMPTY_MAP, // FIXME it is an overly general dependency
    isGooglePlayHiding,
    (stories, postings, hiding) =>
        stories
            .filter(t => t.postingId == null || postings[t.postingId]?.posting)
            .map(t =>
                ({story: t, ...(t.postingId != null ? postings[t.postingId]! : {posting: null, deleting: false})})
            )
            .filter(({posting}) =>
                posting == null || !hiding || !isPostingSheriffProhibited(posting, SHERIFF_GOOGLE_PLAY_TIMELINE)
            )
);

function toSafeRange(moment: number): number {
    if (moment > Number.MAX_SAFE_INTEGER) {
        return Number.MAX_SAFE_INTEGER;
    }
    if (moment < Number.MIN_SAFE_INTEGER) {
        return Number.MIN_SAFE_INTEGER;
    }
    return moment;
}

function postingMoment(posting: HTMLElement | null): number {
    return posting?.dataset.moment != null ? parseInt(posting.dataset.moment) : 0;
}

function getPostingElements(feed: HTMLElement | null): HTMLElement[] {
    return Array.from(feed?.querySelectorAll<HTMLElement>(".posting:not(.linked-posting)") ?? []);
}

function getTopmostMoment(feed: HTMLElement | null): number {
    const top = getPageHeaderHeight();
    for (const posting of getPostingElements(feed)) {
        if (posting.getBoundingClientRect().top >= top) {
            return postingMoment(posting);
        }
    }
    return Number.MAX_SAFE_INTEGER;
}

function getMomentAbove(feed: HTMLElement | null, moment: number): number | null {
    let momentAbove = null;
    for (const posting of getPostingElements(feed)) {
        const thisMoment = postingMoment(posting);
        if (thisMoment === moment) {
            break;
        }
        momentAbove = thisMoment;
    }
    return momentAbove;
}

function getPostingAt(feed: HTMLElement | null, moment: number): HTMLElement | null {
    const postings = getPostingElements(feed);
    for (const posting of postings) {
        if (postingMoment(posting) <= moment) {
            return posting;
        }
    }
    return postings.length > 0 ? postings[postings.length - 1] : null;
}

function getNotViewedMoment(feed: HTMLElement | null): number | null {
    const top = getPageHeaderHeight();
    for (const posting of getPostingElements(feed)) {
        if (posting.getBoundingClientRect().top >= top && posting.dataset.viewed === "false") {
            return postingMoment(posting);
        }
    }
    return null;
}

function markAllViewed(feed: HTMLElement | null): void {
    const top = getPageHeaderHeight();
    for (const posting of getPostingElements(feed)) {
        if (posting.getBoundingClientRect().top >= top) {
            posting.dataset.viewed = "true";
            posting.classList.remove("not-viewed");
        }
    }
}
