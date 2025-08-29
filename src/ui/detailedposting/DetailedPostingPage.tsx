import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { tTitle } from "i18n";
import { PostingInfo } from "api";
import { ClientState } from "state/state";
import { dispatch } from "state/store-sagas";
import { isAtHomeNode, isGooglePlayHiding } from "state/node/selectors";
import { detailedPostingLoad } from "state/detailedposting/actions";
import { getDetailedPosting, isDetailedPostingBeingDeleted } from "state/detailedposting/selectors";
import { getPostingFeedReference, isPostingSheriffProhibited } from "state/postings/selectors";
import { Button, Loading } from "ui/control";
import { MinimalStoryInfo } from "ui/types";
import { getFeedBackTitle } from "ui/feed/feeds";
import { useMainMenuHomeNews } from "ui/mainmenu/pages/main-menu";
import BottomMenu from "ui/mainmenu/BottomMenu";
import { Page } from "ui/page/Page";
import BackBox from "ui/page/BackBox";
import DesktopBack from "ui/page/DesktopBack";
import MobileBack from "ui/page/MobileBack";
import DetailedPosting from "ui/detailedposting/DetailedPosting";
import { ReactComponent as NotFound } from "ui/detailedposting/NotFound.isvg";
import { REL_CURRENT, REL_HOME, RelNodeName } from "util/rel-node-name";
import "./DetailedPostingPage.css";

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

function getBackFeedAndStory(atHome: boolean, posting: PostingInfo | null, t: TFunction, newsHref: string): {
    story: MinimalStoryInfo | null, backNodeName: RelNodeName | string, backHref: string, backTitle: string
} {
    if (posting == null) {
        return {story: null, backNodeName: REL_HOME, backHref: newsHref, backTitle: getFeedBackTitle("news", t)};
    }

    let story = getStory(posting, "timeline");
    let backNodeName = REL_CURRENT;
    let backHref = "/timeline";
    let backTitle = getFeedBackTitle("timeline", t);
    if (story == null && atHome) {
        story = getStory(posting, "news");
        backNodeName = REL_HOME;
        backHref = "/news";
        backTitle = getFeedBackTitle("news", t);
    }
    if (story == null) {
        backNodeName = REL_HOME;
        backHref = newsHref;
        backTitle = getFeedBackTitle("news", t);
    } else {
        backHref = `${backHref}?before=${story.moment}`;
    }

    return {story, backNodeName, backHref, backTitle};
}

export default function DetailedPostingPage() {
    const atHome = useSelector(isAtHomeNode);
    const loading = useSelector((state: ClientState) => state.detailedPosting.loading);
    const deleting = useSelector(isDetailedPostingBeingDeleted);
    const posting = useSelector(getDetailedPosting);
    const googlePlayHiding = useSelector(isGooglePlayHiding);
    const newsHref = useMainMenuHomeNews().href;
    const {t} = useTranslation();

    const {story = null, backNodeName, backHref, backTitle} = useMemo(
        () => getBackFeedAndStory(atHome, posting, t, newsHref),
        [atHome, newsHref, posting, t]
    );
    const googlePlayProhibited = googlePlayHiding && isPostingSheriffProhibited(posting, SHERIFF_GOOGLE_PLAY_TIMELINE);
    const postingReady = posting != null && posting.parentMediaId == null && !googlePlayProhibited;

    const onTryAgain = () => dispatch(detailedPostingLoad());

    return (
        <Page className="detailed-posting-page">
            <div className="page-central-pane">
                <BackBox>
                    <DesktopBack nodeName={backNodeName} href={backHref}>
                        {backTitle}
                    </DesktopBack>
                    <MobileBack nodeName={backNodeName} href={backHref}>
                        {t("posting")}
                    </MobileBack>
                </BackBox>
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
                        <NotFound/>
                        <div className="caption">{tTitle(t("posting-not-found"))}</div>
                        <div className="instructions">
                            {!googlePlayProhibited
                                ? t("posting-not-found-or-displayed")
                                : t("content-not-accessible-android")
                            }
                        </div>
                        {!googlePlayProhibited &&
                            <Button variant="primary" onClick={onTryAgain}>{tTitle(t("try-again"))}</Button>
                        }
                    </div>
                }
            </div>
            <BottomMenu/>
        </Page>
    );
}
