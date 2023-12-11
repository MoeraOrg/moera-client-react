import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '@uidotdev/usehooks';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { ClientState } from "state/state";
import { isAtHomeNode, isGooglePlayHiding } from "state/node/selectors";
import {
    feedFutureSliceLoad,
    feedPastSliceLoad,
    feedScrolled,
    feedScrolledToAnchor,
    feedStatusUpdate
} from "state/feeds/actions";
import { getFeedState } from "state/feeds/selectors";
import { isPostingSheriffProhibited } from "state/postings/selectors";
import { Page } from "ui/page/Page";
import FeedTitle from "ui/feed/FeedTitle";
import FeedPageHeader from "ui/feed/FeedPageHeader";
import FeedPosting from "ui/feed/FeedPosting";
import FeedSentinel from "ui/feed/FeedSentinel";
import { getPageHeaderHeight } from "util/misc";
import "./FeedPage.css";

interface Props {
    feedName: string;
    visible: boolean;
    title: string;
    shareable?: boolean;
}

export default function FeedPage({feedName, visible, title, shareable}: Props) {
    const loadingFuture = useSelector((state: ClientState) => getFeedState(state, feedName).loadingFuture);
    const loadingPast = useSelector((state: ClientState) => getFeedState(state, feedName).loadingPast);
    const before = useSelector((state: ClientState) => getFeedState(state, feedName).before);
    const after = useSelector((state: ClientState) => getFeedState(state, feedName).after);
    const stories = useSelector((state: ClientState) => getStories(state, feedName));
    const totalInFuture = useSelector((state: ClientState) => getFeedState(state, feedName).totalInFuture);
    const totalPinned = useSelector((state: ClientState) => getFeedState(state, feedName).status.totalPinned);
    const notViewed = useSelector((state: ClientState) => getFeedState(state, feedName).status.notViewed);
    const notViewedMoment = useSelector((state: ClientState) => getFeedState(state, feedName).status.notViewedMoment);
    const anchor = useSelector((state: ClientState) => getFeedState(state, feedName).anchor);
    const atHomeNode = useSelector(isAtHomeNode);
    const dispatch = useDispatch();

    const [atTop, setAtTop] = useState<boolean>(true);
    const [atBottom, setAtBottom] = useState<boolean>(false);
    const [topmostMoment, setTopmostMoment] = useState<number>(Number.MAX_SAFE_INTEGER);

    const {t} = useTranslation();

    useEffect(() => {
        if (
            anchor != null
            && (anchor <= before || (anchor >= Number.MAX_SAFE_INTEGER && before >= Number.MAX_SAFE_INTEGER))
            && (anchor > after || (anchor <= Number.MIN_SAFE_INTEGER && after <= Number.MIN_SAFE_INTEGER))
        ) {
            if (scrollTo(anchor)) {
                dispatch(feedScrolledToAnchor(feedName));
            }
        }
    }, [after, anchor, before, dispatch, feedName]);

    useEffect(() => {
        if (anchor == null) {
            scrollTo(topmostMoment);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [before]);

    const loadFuture = useCallback(() => {
        if (loadingFuture || before >= Number.MAX_SAFE_INTEGER) {
            return;
        }
        dispatch(feedFutureSliceLoad(feedName));
    }, [before, dispatch, feedName, loadingFuture]);

    const loadPast = useCallback(() => {
        if (loadingPast || after <= Number.MIN_SAFE_INTEGER) {
            return;
        }
        dispatch(feedPastSliceLoad(feedName));
    }, [after, dispatch, feedName, loadingPast]);

    const onScroll = useCallback(() => setTopmostMoment(getTopmostMoment()), []);

    useEffect(() => {
        if (visible) {
            window.addEventListener("scroll", onScroll);
        }
        return () => window.removeEventListener("scroll", onScroll);
    }, [onScroll, visible]);

    const at = useDebounce(topmostMoment, 500);
    useEffect(() => {
        dispatch(feedScrolled(feedName, at));
    }, [at, dispatch, feedName]);

    const momentToView = useDebounce(getNotViewedMoment(), 1000);
    useEffect(() => {
        if (!atHomeNode) {
            return;
        }
        if (momentToView != null) {
            markAllViewed();
            dispatch(feedStatusUpdate(":" + feedName, true, null, momentToView));
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
                            totalAfterTop={totalAfterTop}
                            notViewed={notViewed ?? 0} notViewedMoment={notViewedMoment ?? null}/>
            <Page>
                <FeedSentinel loading={loadingFuture} title={t("load-newer-posts")} margin="50% 0px 0px 0px"
                              visible={before < Number.MAX_SAFE_INTEGER} onSentinel={onSentinelFuture}
                              onBoundary={onBoundaryFuture} onClick={loadFuture}/>
                {stories.map(({story, posting, deleting}) =>
                    <FeedPosting key={story.moment} posting={posting} story={story} deleting={deleting}/>)
                }
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

export const getStories = createSelector(
    (state: ClientState, feedName: string) => getFeedState(state, feedName).stories,
    (state: ClientState) => state.postings[""] ?? {}, // FIXME it is an overly general dependency
    isGooglePlayHiding,
    (stories, postings, hiding) =>
        stories
            .filter(t => t.postingId != null)
            .filter(t => postings[t.postingId!])
            .map(t => ({story: t, ...postings[t.postingId!]!}))
            .filter(({posting}) => !hiding || !isPostingSheriffProhibited(posting, SHERIFF_GOOGLE_PLAY_TIMELINE))
);

function postingMoment(posting: HTMLElement): number {
    return posting.dataset.moment != null ? parseInt(posting.dataset.moment) : 0;
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
        if (posting == null) {
            continue;
        }
        if (postingMoment(posting) <= moment) {
            return posting;
        }
    }
    return null;
}

function getEarliestPosting(): Element | null {
    const postings = document.getElementsByClassName("posting");
    return postings.length > 0 ? postings.item(postings.length - 1) : null;
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

function scrollTo(moment: number): boolean {
    const posting = moment > Number.MIN_SAFE_INTEGER ? getPostingAt(moment) : getEarliestPosting();
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
