import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import TimelinePage from "ui/timeline/TimelinePage";
import ProfilePage from "ui/profile/ProfilePage";
import DetailedPostingPage from "ui/detailedposting/DetailedPostingPage";
import ComposePage from "ui/compose/ComposePage";
import SettingsPage from "ui/settings/SettingsPage";
import NewsPage from "ui/news/NewsPage";
import PeoplePage from "ui/people/PeoplePage";
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
import { ClientState } from "state/state";

type Props = ConnectedProps<typeof connector>;

function CurrentPage({page, positioned}: Props) {
    useEffect(() => {
        if (page !== PAGE_TIMELINE && page !== PAGE_NEWS && (page !== PAGE_DETAILED_POSTING || !positioned)) {
            window.scrollTo(0, 0);
        }
    }, [page, positioned]);

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
        positioned: isDetailedPostingPositioned(state)
    })
);

export default connector(CurrentPage);
