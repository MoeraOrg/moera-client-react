import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { isPostingSheriffProhibited } from "state/postings/selectors";
import { useDebounce } from "ui/hook";
import { Page } from "ui/page/Page";
import FeedTitle from "ui/feed/FeedTitle";
import FeedPageHeader from "ui/feed/FeedPageHeader";
import FeedStory from "ui/feed/FeedStory";
import FeedSentinel from "ui/feed/FeedSentinel";
import { REL_HOME, RelNodeName } from "util/rel-node-name";
import { getPageHeaderHeight } from "util/ui";
import "./FeedPage.css";

interface Props {
    nodeName: RelNodeName | string;
    feedName: string;
    visible: boolean;
    title: string;
    shareable?: boolean;
}

export default function FeedPage({nodeName, feedName, visible, title, shareable}: Props) {
    const loadingFuture = useSelector((state: ClientState) => getFeedState(state, nodeName, feedName).loadingFuture);
    const loadingPast = useSelector((state: ClientState) => getFeedState(state, nodeName, feedName).loadingPast);
    const before = useSelector((state: ClientState) => getFeedState(state, nodeName, feedName).before);
    const after = useSelector((state: ClientState) => getFeedState(state, nodeName, feedName).after);
    const stories = useSelector((state: ClientState) => getStories(state, nodeName, feedName));
    const totalInFuture = useSelector((state: ClientState) => getFeedState(state, nodeName, feedName).totalInFuture);
    const totalPinned = useSelector((state: ClientState) => getFeedState(state, nodeName, feedName).status.totalPinned);
    const notViewed = useSelector((state: ClientState) => getFeedState(state, nodeName, feedName).status.notViewed);
    const notViewedMoment = useSelector((state: ClientState) =>
        getFeedState(state, nodeName, feedName).status.notViewedMoment);
    const anchor = useSelector((state: ClientState) => getFeedState(state, nodeName, feedName).anchor);
    const atHomeNode = useSelector(isAtHomeNode);
    const dispatch = useDispatch();

    const [atTop, setAtTop] = useState<boolean>(true);
    const [atBottom, setAtBottom] = useState<boolean>(false);
    const [topmostMoment, setTopmostMoment] = useState<number>(Number.MAX_SAFE_INTEGER);
    const currentTopmostMoment = useRef<number>(Number.MAX_SAFE_INTEGER);

    const {t} = useTranslation();

    const onScroll = useCallback(() => {
        const moment = getTopmostMoment();
        currentTopmostMoment.current = moment;
        setTopmostMoment(moment);
    }, []);

    const beginning = stories.length > 0 ? stories[0].story.moment : null;
    const prevBeginning = useRef<number | null>(null)

    useEffect(() => {
        if (anchor == null) {
            if (beginning !== prevBeginning.current) {
                scrollTo(currentTopmostMoment.current);
            }
            prevBeginning.current = beginning;
            return;
        }
        prevBeginning.current = beginning;

        const sanchor = toSafeRange(anchor);
        const sbefore = toSafeRange(before);
        const safter = toSafeRange(after);
        if (sbefore > safter
            && sanchor <= sbefore
            && ((sanchor > safter) || (sanchor === safter && safter === Number.MIN_SAFE_INTEGER))
        ) {
            scrollTo(sanchor);
            onScroll();
            dispatch(feedScrolledToAnchor(nodeName, feedName));
        }
    }, [after, anchor, before, beginning, dispatch, feedName, nodeName, onScroll]);

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

    const [momentToView] = useDebounce(getNotViewedMoment(), 1000);
    useEffect(() => {
        if (!atHomeNode) {
            return;
        }
        if (momentToView != null) {
            markAllViewed();
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

    const totalAfterTop = useMemo((): number => {
        if (topmostMoment >= Number.MAX_SAFE_INTEGER) {
            return 0;
        }
        const afterTop = stories.filter(({story}) => story.moment > topmostMoment).length;
        const total = afterTop + totalInFuture - totalPinned;

        return total > 0 ? total : 0;
    }, [stories, topmostMoment, totalInFuture, totalPinned]);

    if (stories.length === 0 && !loadingFuture && !loadingPast
        && before >= Number.MAX_SAFE_INTEGER && after <= Number.MIN_SAFE_INTEGER) {

        return (
            <>
                <FeedTitle/>
                <FeedPageHeader nodeName={nodeName} feedName={feedName} title={title} empty atTop={true} atBottom={true}
                                totalAfterTop={0} notViewed={0} notViewedMoment={null}/>
                <div className="no-postings">{t("nothing-yet")}</div>
            </>
        );
    }

    return (
        <>
            <FeedTitle/>
            <FeedPageHeader nodeName={nodeName} feedName={feedName} title={title} shareable={shareable}
                            atTop={atTop && before >= Number.MAX_SAFE_INTEGER}
                            atBottom={atBottom && after <= Number.MIN_SAFE_INTEGER}
                            totalAfterTop={totalAfterTop}
                            notViewed={notViewed ?? 0} notViewedMoment={notViewedMoment ?? null}/>
            <Page>
                <FeedSentinel loading={loadingFuture} title={t("load-newer-posts")} margin="50% 0px 0px 0px"
                              visible={before < Number.MAX_SAFE_INTEGER} onSentinel={onSentinelFuture}
                              onBoundary={onBoundaryFuture} onClick={loadFuture}/>
                {stories.map(({story, posting, deleting}) =>
                    <FeedStory key={story.moment} nodeName={nodeName} posting={posting} feedName={feedName}
                               story={story} deleting={deleting}/>
                )}
                <FeedSentinel bottom loading={loadingPast} title={t("load-older-posts")} margin="0px 0px 50% 0px"
                              visible={after > Number.MIN_SAFE_INTEGER} onSentinel={onSentinelPast}
                              onBoundary={onBoundaryPast} onClick={loadPast}/>
                {after <= Number.MIN_SAFE_INTEGER &&
                    <div className="feed-end">&mdash; {t("reached-bottom")} &mdash;</div>
                }
            </Page>
        </>
    );
}

const getStories = createSelector(
    (state: ClientState, nodeName: RelNodeName | string, feedName: string) =>
        getFeedState(state, nodeName, feedName).stories,
    (state: ClientState) => state.postings[getOwnerNameOrUrl(state)] ?? {}, // FIXME it is an overly general dependency
    isGooglePlayHiding,
    (stories, postings, hiding) =>
        stories
            .filter(t => t.postingId == null || postings[t.postingId])
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

function getTopmostMoment(): number {
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

function getPostingAt(moment: number): HTMLElement | null {
    const postings = document.getElementsByClassName("posting");
    for (let i = 0; i < postings.length; i++) {
        const posting = postings.item(i) as HTMLElement;
        if (postingMoment(posting) <= moment) {
            return posting;
        }
    }
    return postings.length > 0 ? postings.item(postings.length - 1) as HTMLElement : null;
}

function getNotViewedMoment(): number | null {
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

function markAllViewed(): void {
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

function scrollTo(moment: number): void {
    const posting = getPostingAt(moment);
    if (posting != null) {
        const y = posting.getBoundingClientRect().top;
        const minY = getPageHeaderHeight() + 10;
        window.scrollBy(0, y - minY - 25);
    }
}
