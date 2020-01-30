import React from 'react';
import { connect } from 'react-redux';

import Storage from "ui/storage/Storage";
import HomeEvents from "ui/events/HomeEvents";
import NodeEvents from "ui/events/NodeEvents";
import Navigation from "ui/navigation/Navigation";
import ErrorPane from "ui/error/ErrorPane";
import MainMenu from "ui/mainmenu/MainMenu";
import {
    isAtComposePage,
    isAtDetailedPostingPage,
    isAtProfilePage,
    isAtSettingsPage,
    isAtTimelinePage
} from "state/navigation/selectors";
import TimelinePage from "ui/timeline/TimelinePage";
import ProfilePage from "ui/profile/ProfilePage";
import DetailedPostingPage from "ui/detailedposting/DetailedPostingPage";
import ComposePage from "ui/compose/ComposePage";
import SettingsPage from "ui/settings/SettingsPage";
import ReactionsDialog from "ui/reactionsdialog/ReactionsDialog";
import MessageBox from "ui/messagebox/MessageBox";
import ConfirmBox from "ui/confirmbox/ConfirmBox";
import "./colors.css";
import "./App.css";

const ContentImpl = ({atTimelinePage, atProfilePage, atDetailedPostingPage, atComposePage, atSettingsPage}) => (
    <>
        {atTimelinePage && <TimelinePage />}
        {atProfilePage && <ProfilePage />}
        {atDetailedPostingPage && <DetailedPostingPage />}
        {atComposePage && <ComposePage />}
        {atSettingsPage && <SettingsPage />}
    </>
);

const Content = connect(
    state => ({
        atTimelinePage: isAtTimelinePage(state),
        atProfilePage: isAtProfilePage(state),
        atDetailedPostingPage: isAtDetailedPostingPage(state),
        atComposePage: isAtComposePage(state),
        atSettingsPage: isAtSettingsPage(state)
    })
)(ContentImpl);

const App = () => (
    <>
        <Storage/>
        <HomeEvents/>
        <NodeEvents/>
        <Navigation/>
        <ErrorPane/>
        <MainMenu/>
        <Content/>
        <ReactionsDialog/>
        <MessageBox/>
        <ConfirmBox/>
    </>
);

export default App;
