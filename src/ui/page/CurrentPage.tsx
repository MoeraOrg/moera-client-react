import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { ClientState } from "state/state";
import {
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
import ComposePage from "ui/compose/ComposePage";
import SettingsPage from "ui/settings/SettingsPage";
import NewsPage from "ui/news/NewsPage";
import PeoplePage from "ui/people/PeoplePage";
import GooglePlayProhibitedPage from "ui/page/GooglePlayProhibitedPage";

type Props = ConnectedProps<typeof connector>;

function CurrentPage({page, positioned, googlePlayProhibited}: Props) {
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
            return <ComposePage/>;
        case PAGE_SETTINGS:
            return <SettingsPage/>;
        case PAGE_NEWS:
            return <NewsPage/>;
        case PAGE_PEOPLE:
            return <PeoplePage/>;
        default:
            return null;
    }
}

const connector = connect(
    (state: ClientState) => ({
        page: state.navigation.page,
        positioned: isDetailedPostingPositioned(state),
        googlePlayProhibited: isGooglePlayHiding(state)
            && isFeedGeneralReady(state, "timeline")
            && isFeedSheriffProhibited(state, "timeline", SHERIFF_GOOGLE_PLAY_TIMELINE)
    })
);

export default connector(CurrentPage);
