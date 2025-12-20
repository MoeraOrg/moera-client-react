import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { tTitle } from "i18n";
import { NodeName, PostingInfo } from "api";
import { ClientState } from "state/state";
import { getOwnerFullName, getOwnerName, isAtHomeNode, isGooglePlayHiding } from "state/node/selectors";
import { detailedPostingLoad } from "state/detailedposting/actions";
import { getDetailedPosting, isDetailedPostingBeingDeleted } from "state/detailedposting/selectors";
import { getPostingFeedReference, isPostingSheriffProhibited } from "state/postings/selectors";
import { Button, Loading } from "ui/control";
import { MinimalStoryInfo } from "ui/types";
import { useIsTinyScreen } from "ui/hook";
import { useHomeNews } from "ui/feed/feeds";
import DesktopMainMenu from "ui/mainmenu/DesktopMainMenu";
import MainMenuSidebar from "ui/mainmenu/MainMenuSidebar";
import BottomMenu from "ui/mainmenu/BottomMenu";
import { Page } from "ui/page/Page";
import BackBox from "ui/page/BackBox";
import BackBoxInner from "ui/page/BackBoxInner";
import DesktopBack from "ui/page/DesktopBack";
import MobileBack from "ui/page/MobileBack";
import { ReactComponent as GooglePlayProhibited } from "ui/page/GooglePlayProhibited.isvg";
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

function getBackFeedAndStory(
    atHome: boolean, nodeName: string | null, nodeFullName: string | null, posting: PostingInfo | null, t: TFunction,
    newsHref: string
): {
    story: MinimalStoryInfo | null, backNodeName: RelNodeName | string, backHref: string, backTitle: string
} {
    if (posting == null) {
        return {story: null, backNodeName: REL_HOME, backHref: newsHref, backTitle: t("back-news")};
    }

    let story = getStory(posting, "timeline");
    let backNodeName = REL_CURRENT;
    let backHref = "/timeline";
    let backTitle = atHome ? t("back-your-posts") : t("back-posts", {name: nodeFullName || NodeName.shorten(nodeName)});
    if (story == null && atHome) {
        story = getStory(posting, "news");
        backNodeName = REL_HOME;
        backHref = "/news";
        backTitle = t("back-news");
    }
    if (story == null && atHome) {
        story = getStory(posting, "explore");
        backNodeName = REL_HOME;
        backHref = "/explore";
        backTitle = t("back-explore");
    }
    if (story == null) {
        backNodeName = REL_HOME;
        backHref = newsHref;
        backTitle = t("back-news");
    } else {
        backHref = `${backHref}?before=${story.moment}`;
    }

    return {story, backNodeName, backHref, backTitle};
}

export default function DetailedPostingPage() {
    const atHome = useSelector(isAtHomeNode);
    const nodeName = useSelector(getOwnerName);
    const nodeFullName = useSelector(getOwnerFullName);
    const loading = useSelector((state: ClientState) => state.detailedPosting.loading);
    const deleting = useSelector(isDetailedPostingBeingDeleted);
    const posting = useSelector(getDetailedPosting);
    const googlePlayHiding = useSelector(isGooglePlayHiding);
    const newsHref = useHomeNews();
    const tinyScreen = useIsTinyScreen();
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const {story = null, backNodeName, backHref, backTitle} = useMemo(
        () => getBackFeedAndStory(atHome, nodeName, nodeFullName, posting, t, newsHref),
        [atHome, newsHref, nodeFullName, nodeName, posting, t]
    );
    const googlePlayProhibited = googlePlayHiding && isPostingSheriffProhibited(posting, SHERIFF_GOOGLE_PLAY_TIMELINE);
    const postingReady = posting != null && posting.parentMediaId == null && !googlePlayProhibited;

    const onTryAgain = () => dispatch(detailedPostingLoad());

    return (
        <>
            <DesktopMainMenu/>
            <Page className="detailed-posting-page">
                <div className="page-left-pane">
                    <MainMenuSidebar/>
                </div>
                <div className="page-central-pane">
                    <BackBox shadowMargin={tinyScreen ? 0 : undefined}>
                        <BackBoxInner>
                            <DesktopBack nodeName={backNodeName} href={backHref}>
                                {backTitle}
                            </DesktopBack>
                            <MobileBack nodeName={backNodeName} href={backHref}>
                                {t("posting")}
                            </MobileBack>
                        </BackBoxInner>
                    </BackBox>
                    {postingReady &&
                        <DetailedPosting posting={posting} story={story} deleting={deleting}/>
                    }
                    {!postingReady && loading &&
                        <main className="posting">
                            <Loading/>
                        </main>
                    }
                    {!postingReady && !loading &&
                        <main className="posting-not-found">
                            {googlePlayProhibited ?
                                <>
                                    <GooglePlayProhibited/>
                                    <div className="caption">{tTitle(t("not-accessible"))}</div>
                                    <div className="instructions">{t("content-not-accessible-android")}</div>
                                </>
                            :
                                <>
                                    <NotFound/>
                                    <div className="caption">{tTitle(t("posting-not-found"))}</div>
                                    <div className="instructions">
                                        {t("posting-not-found-or-displayed")}
                                    </div>
                                    <Button variant="primary" onClick={onTryAgain}>{tTitle(t("try-again"))}</Button>
                                </>
                            }
                        </main>
                    }
                </div>
                <BottomMenu/>
            </Page>
        </>
    );
}
