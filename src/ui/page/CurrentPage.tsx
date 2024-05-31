import React, { Suspense, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { ClientState } from "state/state";
import { isDetailedPostingPositioned } from "state/detailedposting/selectors";
import { isGooglePlayHiding } from "state/node/selectors";
import { isFeedGeneralReady, isFeedSheriffProhibited } from "state/feeds/selectors";
import { Loading } from "ui/control";
import TimelinePage from "ui/feed/TimelinePage";
import ProfilePage from "ui/profile/ProfilePage";
import DetailedPostingPage from "ui/detailedposting/DetailedPostingPage";
import NewsPage from "ui/feed/NewsPage";
import GooglePlayProhibitedPage from "ui/page/GooglePlayProhibitedPage";
import { REL_CURRENT } from "util/rel-node-name";

const ComposePage = React.lazy(() => import("ui/compose/ComposePage"));
const SettingsPage = React.lazy(() => import("ui/settings/SettingsPage"));
const PeoplePage = React.lazy(() => import("ui/people/PeoplePage"));
const ComplaintsPage = React.lazy(() => import("ui/complaints/ComplaintsPage"));

export default function CurrentPage() {
    const page = useSelector((state: ClientState) => state.navigation.page);
    const positioned = useSelector(isDetailedPostingPositioned);
    const googlePlayProhibited = useSelector(
        (state: ClientState) => isGooglePlayHiding(state)
            && isFeedGeneralReady(state, REL_CURRENT, "timeline")
            && isFeedSheriffProhibited(state, REL_CURRENT, "timeline", SHERIFF_GOOGLE_PLAY_TIMELINE)
    );

    useEffect(() => {
        if (page !== "timeline" && page !== "news" && (page !== "detailedposting" || !positioned)) {
            setTimeout(() => window.scrollTo(0, 0));
        }
    }, [page, positioned]);

    if (googlePlayProhibited) {
        return <GooglePlayProhibitedPage/>;
    }

    switch (page) {
        case "timeline":
            return <TimelinePage/>;
        case "profile":
            return <ProfilePage/>;
        case "detailedposting":
            return <DetailedPostingPage/>;
        case "compose":
            return (
                <Suspense fallback={<Loading overlay large/>}>
                    <ComposePage/>;
                </Suspense>
            );
        case "settings":
            return (
                <Suspense fallback={<Loading overlay large/>}>
                    <SettingsPage/>
                </Suspense>
            );
        case "news":
            return <NewsPage/>;
        case "people":
            return (
                <Suspense fallback={<Loading overlay large/>}>
                    <PeoplePage/>
                </Suspense>
            );
        case "complaints":
            return (
                <Suspense fallback={<Loading overlay large/>}>
                    <ComplaintsPage/>
                </Suspense>
            );
        default:
            return null;
    }
}
