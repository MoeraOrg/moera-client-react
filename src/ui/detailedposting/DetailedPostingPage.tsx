import React from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { PostingInfo } from "api";
import { ClientState } from "state/state";
import { isGooglePlayHiding } from "state/node/selectors";
import { getDetailedPosting, isDetailedPostingBeingDeleted } from "state/detailedposting/selectors";
import { getPostingFeedReference, isPostingSheriffProhibited } from "state/postings/selectors";
import { Loading } from "ui/control";
import { MinimalStoryInfo } from "ui/types";
import { Page } from "ui/page/Page";
import DetailedPostingPageHeader from "ui/detailedposting/DetailedPostingPageHeader";
import DetailedPosting from "ui/detailedposting/DetailedPosting";
import { getFeedTitle } from "ui/feed/feeds";
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

function getFeedAndStory(posting: PostingInfo | null, t: TFunction): {
    story: MinimalStoryInfo | null, href: string, feedTitle: string
} {
    if (posting == null) {
        return {story: null, href: "", feedTitle: ""};
    }

    let story = getStory(posting, "timeline");
    let href = "/timeline";
    let feedTitle = getFeedTitle("timeline", t);
    if (story == null) {
        story = getStory(posting, "news");
        href = "/news";
        feedTitle = getFeedTitle("news", t);
    }
    return {story, href, feedTitle};
}

export default function DetailedPostingPage() {
    const loading = useSelector((state: ClientState) => state.detailedPosting.loading);
    const deleting = useSelector(isDetailedPostingBeingDeleted);
    const posting = useSelector(getDetailedPosting);
    const googlePlayHiding = useSelector(isGooglePlayHiding);
    const {t} = useTranslation();

    const {story = null, href, feedTitle} = getFeedAndStory(posting, t);
    const googlePlayProhibited = googlePlayHiding && isPostingSheriffProhibited(posting, SHERIFF_GOOGLE_PLAY_TIMELINE);
    const postingReady = posting != null && posting.parentMediaId == null && !googlePlayProhibited;
    return (
        <>
            <DetailedPostingPageHeader story={story} href={href} feedTitle={feedTitle}/>
            <Page>
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
                        <FontAwesomeIcon className="icon" icon="frown" size="3x"/>
                        <div className="message">
                            {posting == null || posting.parentMediaId != null
                                ? t("posting-not-found")
                                : t("content-not-accessible-android")
                            }
                        </div>
                    </div>
                }
            </Page>
        </>
    );
}
