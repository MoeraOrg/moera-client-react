import React from 'react';
import { connect } from 'react-redux';

import { isAtNode } from "state/node/selectors";
import { getSetting } from "state/settings/selectors";
import Storage from "ui/storage/Storage";
import HomeEvents from "ui/events/HomeEvents";
import NodeEvents from "ui/events/NodeEvents";
import ReceiverEvents from "ui/events/ReceiverEvents";
import Navigation from "ui/navigation/Navigation";
import ErrorPane from "ui/error/ErrorPane";
import MainMenu from "ui/mainmenu/MainMenu";
import CurrentPage from "ui/page/CurrentPage";
import WelcomePage from "ui/welcome/WelcomePage";
import BottomMenu from "ui/bottommenu/BottomMenu";
import ReactionsDialog from "ui/reactionsdialog/ReactionsDialog";
import ChangeDateDialog from "ui/changedatedialog/ChangeDateDialog";
import ShareDialog from "ui/sharedialog/ShareDialog";
import MessageBox from "ui/messagebox/MessageBox";
import ConfirmBox from "ui/confirmbox/ConfirmBox";
import FlashBox from "ui/flashbox/FlashBox";
import SignUpDialog from "ui/signupdialog/SignUpDialog";
import MnemonicDialog from "ui/profile/manage/MnemonicDialog";
import QuickTips from "ui/quicktips/QuickTips";
import "./colors.css";
import "./App.css";


const App = ({atNode, feedWidth}) => (
    <div style={{"--feed-width": feedWidth + "px"}}>
        <Storage/>
        <HomeEvents/>
        <NodeEvents/>
        <ReceiverEvents/>
        <Navigation/>
        <ErrorPane/>
        <MainMenu/>
        {atNode ?
            <>
                <CurrentPage/>
                <ReactionsDialog/>
                <ChangeDateDialog/>
            </>
        :
            <WelcomePage/>
        }
        <BottomMenu/>
        <ShareDialog/>
        <SignUpDialog/>
        <MnemonicDialog/>
        <QuickTips/>
        <MessageBox/>
        <ConfirmBox/>
        <FlashBox/>
    </div>
);

export default connect(
    state => ({
        atNode: isAtNode(state),
        feedWidth: getSetting(state, "feed.width")
    })
)(App);
