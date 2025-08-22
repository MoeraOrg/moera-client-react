import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { PostingInfo } from "api";
import { ClientState } from "state/state";
import { NavigationStackItem } from "state/navigation/state";
import { getNavigationStack } from "state/navigation/selectors";
import { getOwnerName, isGooglePlayHiding } from "state/node/selectors";
import { getHomeOwnerName } from "state/home/selectors";
import { getDetailedPosting, isDetailedPostingBeingDeleted } from "state/detailedposting/selectors";
import { getPostingFeedReference, isPostingSheriffProhibited } from "state/postings/selectors";
import { Loading } from "ui/control";
import { MinimalStoryInfo } from "ui/types";
import { getFeedBackTitle } from "ui/feed/feeds";
import BottomMenu from "ui/mainmenu/BottomMenu";
import { Page } from "ui/page/Page";
import DesktopBack from "ui/page/DesktopBack";
import MobileBack from "ui/page/MobileBack";
import DetailedPosting from "ui/detailedposting/DetailedPosting";
import { REL_CURRENT, REL_HOME, RelNodeName } from "util/rel-node-name";
import "./DetailedPostingPage.css";

const getLastFeed = (
    state: ClientState, ownerName: string | null | undefined, homeOwnerName: string | null | undefined
): NavigationStackItem | undefined =>
    getNavigationStack(state).findLast(item =>
        (item.nodeName === ownerName && item.location.startsWith("/timeline"))
        || (item.nodeName === homeOwnerName && item.location.startsWith("/news"))
    );

function getStory(posting: PostingInfo, feedName: string): MinimalStoryInfo | null {
    const feedReference = getPostingFeedReference(posting, feedName);
    if (feedReference == null) {
        return null;
    }
    return {
        id: feedReference.storyId,
        ...feedReference
    }
}

function getFeedAndStory(
    atHome: boolean, lastFeed: NavigationStackItem | undefined, posting: PostingInfo | null, t: TFunction
): {
    story: MinimalStoryInfo | null, backNodeName: RelNodeName | string, backHref: string, backTitle: string
} {
    if (posting == null) {
        return {story: null, backNodeName: REL_CURRENT, backHref: "", backTitle: ""};
    }

    let story: MinimalStoryInfo | null = null;
    let backHref = lastFeed?.location;
    let backTitle = lastFeed?.backTitle;

    if (atHome) {
        if (backHref) {
            if (backHref.startsWith("/timeline")) {
                story = getStory(posting, "timeline");
            } else if (backHref.startsWith("/news")) {
                story = getStory(posting, "news");
            }
        }

        if (story == null) {
            story = getStory(posting, "timeline");
            backHref = "/timeline";
            backTitle = getFeedBackTitle("timeline", t);
        }
        if (story == null) {
            story = getStory(posting, "news");
            backHref = "/news";
            backTitle = getFeedBackTitle("news", t);
        }

        backHref = backHref && story != null ? `${backHref}?before=${story.moment}` : backHref

        return {story, backNodeName: REL_CURRENT, backHref: backHref ?? "", backTitle: backTitle ?? ""};
    }

    story = getStory(posting, "timeline");

    if (backHref) {
        if (backHref.startsWith("/timeline")) {
            backHref = story != null ? `${backHref}?before=${story.moment}` : backHref
            return {story, backNodeName: REL_CURRENT, backHref, backTitle: backTitle ?? ""};
        }
        if (backHref.startsWith("/news")) {
            return {story, backNodeName: REL_HOME, backHref, backTitle: backTitle ?? ""};
        }
    }

    backHref = story != null ? `/timeline?before=${story.moment}` : "/timeline";
    backTitle = getFeedBackTitle("timeline", t);

    return {story, backNodeName: REL_CURRENT, backHref, backTitle};
}

export default function DetailedPostingPage() {
    const ownerName = useSelector(getOwnerName);
    const homeOwnerName = useSelector(getHomeOwnerName);
    const loading = useSelector((state: ClientState) => state.detailedPosting.loading);
    const deleting = useSelector(isDetailedPostingBeingDeleted);
    const posting = useSelector(getDetailedPosting);
    const googlePlayHiding = useSelector(isGooglePlayHiding);
    const lastFeed = useSelector((state: ClientState) => getLastFeed(state, ownerName, homeOwnerName));
    const {t} = useTranslation();

    const {story = null, backNodeName, backHref, backTitle} = useMemo(
        () => getFeedAndStory(ownerName === homeOwnerName, lastFeed, posting, t),
        [homeOwnerName, lastFeed, ownerName, posting, t]
    );
    const googlePlayProhibited = googlePlayHiding && isPostingSheriffProhibited(posting, SHERIFF_GOOGLE_PLAY_TIMELINE);
    const postingReady = posting != null && posting.parentMediaId == null && !googlePlayProhibited;

    return (
        <Page className="detailed-posting-page">
            <div className="page-central-pane">
                <DesktopBack nodeName={backNodeName} href={backHref}>
                    {backTitle}
                </DesktopBack>
                <MobileBack nodeName={backNodeName} href={backHref} sticky>
                    {backTitle}
                </MobileBack>
                {(postingReady && story) &&
                    <DetailedPosting posting={posting} story={story} deleting={deleting}/>
                }
                {!postingReady && loading &&
                    <div className="posting">
                        <Loading/>
                    </div>
                }
                {!postingReady && !loading &&
                    <div className="posting-not-found">
                        <FontAwesomeIcon className="icon" icon={faFrown} size="3x"/>
                        <div className="message">
                            {!googlePlayProhibited
                                ? t("posting-not-found")
                                : t("content-not-accessible-android")
                            }
                        </div>
                    </div>
                }
            </div>
            <BottomMenu/>
        </Page>
    );
}
