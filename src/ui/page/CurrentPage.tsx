import React, { Suspense, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { ClientState } from "state/state";
import {
    PAGE_COMPLAINS,
    PAGE_COMPOSE,
    PAGE_DETAILED_POSTING,
    PAGE_NEWS,
    PAGE_PEOPLE,
    PAGE_PROFILE,
    PAGE_SETTINGS,
    PAGE_TIMELINE
} from "state/navigation/pages";
import { isDetailedPostingPositioned } from "state/detailedposting/selectors";
import { isGooglePlayHiding } from "state/node/selectors";
import { isFeedGeneralReady, isFeedSheriffProhibited } from "state/feeds/selectors";
import TimelinePage from "ui/timeline/TimelinePage";
import ProfilePage from "ui/profile/ProfilePage";
import DetailedPostingPage from "ui/detailedposting/DetailedPostingPage";
import NewsPage from "ui/news/NewsPage";
import GooglePlayProhibitedPage from "ui/page/GooglePlayProhibitedPage";

const ComposePage = React.lazy(() => import("ui/compose/ComposePage"));
const SettingsPage = React.lazy(() => import("ui/settings/SettingsPage"));
const PeoplePage = React.lazy(() => import("ui/people/PeoplePage"));
const ComplainsPage = React.lazy(() => import("ui/complains/ComplainsPage"));

export default function CurrentPage() {
    const page = useSelector((state: ClientState) => state.navigation.page);
    const positioned = useSelector(isDetailedPostingPositioned);
    const googlePlayProhibited = useSelector(
        (state: ClientState) => isGooglePlayHiding(state)
            && isFeedGeneralReady(state, "timeline")
            && isFeedSheriffProhibited(state, "timeline", SHERIFF_GOOGLE_PLAY_TIMELINE)
    );

    useEffect(() => {
        if (page !== PAGE_TIMELINE && page !== PAGE_NEWS && (page !== PAGE_DETAILED_POSTING || !positioned)) {
            setTimeout(() => window.scrollTo(0, 0));
        }
    }, [page, positioned]);

    if (googlePlayProhibited) {
        return <GooglePlayProhibitedPage/>;
    }

    switch (page) {
        case PAGE_TIMELINE:
            return <TimelinePage/>;
        case PAGE_PROFILE:
            return <ProfilePage/>;
        case PAGE_DETAILED_POSTING:
            return <DetailedPostingPage/>;
        case PAGE_COMPOSE:
            return (
                <Suspense fallback={null}>
                    <ComposePage/>;
                </Suspense>
            );
        case PAGE_SETTINGS:
            return (
                <Suspense fallback={null}>
                    <SettingsPage/>
                </Suspense>
            );
        case PAGE_NEWS:
            return <NewsPage/>;
        case PAGE_PEOPLE:
            return (
                <Suspense fallback={null}>
                    <PeoplePage/>
                </Suspense>
            );
        case PAGE_COMPLAINS:
            return (
                <Suspense fallback={null}>
                    <ComplainsPage/>
                </Suspense>
            );
        default:
            return null;
    }
}
