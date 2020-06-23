import React from 'react';
import { connect } from 'react-redux';

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

class CurrentPage extends React.PureComponent {

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.page !== prevProps.page && this.props.page !== PAGE_TIMELINE) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        switch (this.props.page) {
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

}

export default connect(
    state => ({
        page: state.navigation.page
    })
)(CurrentPage);
