import React, { Suspense } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { isAtNode } from "state/node/selectors";
import { getFeedWidth } from "state/settings/selectors";
import { isLightBoxShown } from "state/lightbox/selectors";
import HomeEvents from "ui/events/HomeEvents";
import NodeEvents from "ui/events/NodeEvents";
import ReceiverEvents from "ui/events/ReceiverEvents";
import Navigation from "ui/navigation/Navigation";
import ErrorPane from "ui/error/ErrorPane";
import MainMenu from "ui/mainmenu/MainMenu";
import CurrentPage from "ui/page/CurrentPage";
import WelcomePage from "ui/welcome/WelcomePage";
import BottomMenu from "ui/bottommenu/BottomMenu";
import MessageBox from "ui/messagebox/MessageBox";
import ConfirmBox from "ui/confirmbox/ConfirmBox";
import FlashBox from "ui/flashbox/FlashBox";
import MnemonicDialog from "ui/profile/manage/MnemonicDialog";
import QuickTips from "ui/quicktips/QuickTips";
import EntryCopyTextDialog from "ui/entrycopytextdialog/EntryCopyTextDialog";
import ProgressBox from "ui/progressbox/ProgressBox";
import "./colors.css";
import "./zindex.css";
import "./App.css";

const ReactionsDialog = React.lazy(() => import("ui/reactionsdialog/ReactionsDialog"));
const ChangeDateDialog = React.lazy(() => import("ui/changedatedialog/ChangeDateDialog"));
const SourceDialog = React.lazy(() => import("ui/sourcedialog/SourceDialog"));
const LightBox = React.lazy(() => import("ui/lightbox/LightBox"));
const ImageEditDialog = React.lazy(() => import("ui/imageeditdialog/ImageEditDialog"));
const DonateDialog = React.lazy(() => import("ui/donatedialog/DonateDialog"));
const PeopleHideDialog = React.lazy(() => import("ui/peoplehidedialog/PeopleHideDialog"));
const FriendGroupsDialog = React.lazy(() => import("ui/friendgroupsdialog/FriendGroupsDialog"));
const AskDialog = React.lazy(() => import("ui/askdialog/AskDialog"));
const BlockDialog = React.lazy(() => import("ui/blockdialog/BlockDialog"));
const BlockingDetailsDialog = React.lazy(() => import("ui/blockingdetailsdialog/BlockingDetailsDialog"));
const SheriffOrderDialog = React.lazy(() => import("ui/sherifforderdialog/SheriffOrderDialog"));
const SheriffOrderDetailsDialog = React.lazy(() => import("ui/sherifforderdetailsdialog/SheriffOrderDetailsDialog"));
const SignUpDialog = React.lazy(() => import("ui/signupdialog/SignUpDialog"));
const ShareDialog = React.lazy(() => import("ui/sharedialog/ShareDialog"));

type Props = ConnectedProps<typeof connector>;

const App = ({
    atNode, feedWidth, showReactionsDialog, showChangeDateDialog, showSourceDialog, showLightBox, showImageEditDialog,
    showDonateDialog, showEntryCopyTextDialog, showPeopleHideDialog, showFriendGroupsDialog, showAskDialog,
    showBlockDialog, showBlockingDetailsDialog, showSheriffOrderDialog, showSheriffOrderDetailsDialog, showSignUpDialog,
    showMnemonicDialog, showQuickTips, showMessageBox, showConfirmBox, showFlashBox, showProgressBox, showShareDialog
}: Props) => (
    // FIXME React.CSSProperties does not include CSS variables
    <div style={{"--feed-width": feedWidth + "px"} as any}>
        <HomeEvents/>
        <NodeEvents/>
        <ReceiverEvents/>
        <Navigation/>
        <ErrorPane/>
        <MainMenu/>
        {atNode ?
            <>
                <CurrentPage/>
                <Suspense fallback={null}>
                    {showReactionsDialog && <ReactionsDialog/>}
                </Suspense>
                <Suspense fallback={null}>
                    {showChangeDateDialog && <ChangeDateDialog/>}
                </Suspense>
                <Suspense fallback={null}>
                    {showSourceDialog && <SourceDialog/>}
                </Suspense>
                <Suspense fallback={null}>
                    {showLightBox && <LightBox/>}
                </Suspense>
                <Suspense fallback={null}>
                    {showImageEditDialog && <ImageEditDialog/>}
                </Suspense>
                <Suspense fallback={null}>
                    {showDonateDialog && <DonateDialog/>}
                </Suspense>
                {showEntryCopyTextDialog && <EntryCopyTextDialog/>}
                <Suspense fallback={null}>
                    {showPeopleHideDialog && <PeopleHideDialog/>}
                </Suspense>
                <Suspense fallback={null}>
                    {showFriendGroupsDialog && <FriendGroupsDialog/>}
                </Suspense>
                <Suspense fallback={null}>
                    {showAskDialog && <AskDialog/>}
                </Suspense>
                <Suspense fallback={null}>
                    {showBlockDialog && <BlockDialog/>}
                </Suspense>
                <Suspense fallback={null}>
                    {showBlockingDetailsDialog && <BlockingDetailsDialog/>}
                </Suspense>
                <Suspense fallback={null}>
                    {showSheriffOrderDialog && <SheriffOrderDialog/>}
                </Suspense>
                <Suspense fallback={null}>
                    {showSheriffOrderDetailsDialog && <SheriffOrderDetailsDialog/>}
                </Suspense>
            </>
        :
            <WelcomePage/>
        }
        <BottomMenu/>
        <Suspense fallback={null}>
            {showShareDialog && <ShareDialog/>}
        </Suspense>
        <Suspense fallback={null}>
            {showSignUpDialog && <SignUpDialog/>}
        </Suspense>
        {showMnemonicDialog && <MnemonicDialog/>}
        {showQuickTips && <QuickTips/>}
        {showMessageBox && <MessageBox/>}
        {showConfirmBox && <ConfirmBox/>}
        {showFlashBox && <FlashBox/>}
        {showProgressBox && <ProgressBox/>}
    </div>
);

const connector = connect(
    (state: ClientState) => ({
        atNode: isAtNode(state),
        feedWidth: getFeedWidth(state),
        showReactionsDialog: state.reactionsDialog.show,
        showChangeDateDialog: state.changeDateDialog.show,
        showSourceDialog: state.sourceDialog.show,
        showLightBox: isLightBoxShown(state),
        showImageEditDialog: state.imageEditDialog.show,
        showDonateDialog: state.donateDialog.show,
        showEntryCopyTextDialog: state.entryCopyTextDialog.show,
        showPeopleHideDialog: state.peopleHideDialog.show,
        showFriendGroupsDialog: state.friendGroupsDialog.show,
        showAskDialog: state.askDialog.show,
        showBlockDialog: state.blockDialog.show,
        showBlockingDetailsDialog: state.blockingDetailsDialog.show,
        showSheriffOrderDialog: state.sheriffOrderDialog.show,
        showSheriffOrderDetailsDialog: state.sheriffOrderDetailsDialog.show,
        showSignUpDialog: state.signUpDialog.show,
        showMnemonicDialog: !!state.nodeName.mnemonic,
        showQuickTips: state.quickTips.show,
        showMessageBox: state.messageBox.show,
        showConfirmBox: state.confirmBox.show,
        showFlashBox: state.flashBox.show,
        showProgressBox: state.progressBox.show,
        showShareDialog: state.shareDialog.show
    })
);

export default connector(App);
