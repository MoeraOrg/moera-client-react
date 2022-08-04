import React, { Suspense } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { isAtNode } from "state/node/selectors";
import { getFeedWidth } from "state/settings/selectors";
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
import MessageBox from "ui/messagebox/MessageBox";
import ConfirmBox from "ui/confirmbox/ConfirmBox";
import FlashBox from "ui/flashbox/FlashBox";
import SignUpDialog from "ui/signupdialog/SignUpDialog";
import MnemonicDialog from "ui/profile/manage/MnemonicDialog";
import SourceDialog from "ui/sourcedialog/SourceDialog";
import QuickTips from "ui/quicktips/QuickTips";
import LightBox from "ui/lightbox/LightBox";
import ImageEditDialog from "ui/imageeditdialog/ImageEditDialog";
import DonateDialog from "ui/donatedialog/DonateDialog";
import "./colors.css";
import "./zindex.css";
import "./App.css";
import EntryCopyTextDialog from "ui/entrycopytextdialog/EntryCopyTextDialog";

const ShareDialog = React.lazy(() => import("ui/sharedialog/ShareDialog"));

type Props = ConnectedProps<typeof connector>;

const App = ({atNode, feedWidth}: Props) => (
    // FIXME React.CSSProperties does not include CSS variables
    <div style={{"--feed-width": feedWidth + "px"} as any}>
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
                <SourceDialog/>
                <LightBox/>
                <ImageEditDialog/>
                <DonateDialog/>
                <EntryCopyTextDialog/>
            </>
        :
            <WelcomePage/>
        }
        <BottomMenu/>
        <Suspense fallback={null}>
            <ShareDialog/>
        </Suspense>
        <SignUpDialog/>
        <MnemonicDialog/>
        <QuickTips/>
        <MessageBox/>
        <ConfirmBox/>
        <FlashBox/>
    </div>
);

const connector = connect(
    (state: ClientState) => ({
        atNode: isAtNode(state),
        feedWidth: getFeedWidth(state)
    })
);

export default connector(App);
