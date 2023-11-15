import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';

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
import ChangeDateDialog from "ui/changedatedialog/ChangeDateDialog";
import SourceDialog from "ui/sourcedialog/SourceDialog";
import BlockingDetailsDialog from "ui/blockingdetailsdialog/BlockingDetailsDialog";
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
const LightBox = React.lazy(() => import("ui/lightbox/LightBox"));
const ImageEditDialog = React.lazy(() => import("ui/imageeditdialog/ImageEditDialog"));
const DonateDialog = React.lazy(() => import("ui/donatedialog/DonateDialog"));
const PeopleHideDialog = React.lazy(() => import("ui/peoplehidedialog/PeopleHideDialog"));
const FriendGroupsDialog = React.lazy(() => import("ui/friendgroupsdialog/FriendGroupsDialog"));
const AskDialog = React.lazy(() => import("ui/askdialog/AskDialog"));
const BlockDialog = React.lazy(() => import("ui/blockdialog/BlockDialog"));
const SheriffOrderDialog = React.lazy(() => import("ui/sherifforderdialog/SheriffOrderDialog"));
const SheriffOrderDetailsDialog = React.lazy(() => import("ui/sherifforderdetailsdialog/SheriffOrderDetailsDialog"));
const SignUpDialog = React.lazy(() => import("ui/signupdialog/SignUpDialog"));
const ShareDialog = React.lazy(() => import("ui/sharedialog/ShareDialog"));

export default function App() {
    const atNode = useSelector(isAtNode);
    const feedWidth = useSelector(getFeedWidth);
    const showReactionsDialog = useSelector((state: ClientState) => state.reactionsDialog.show);
    const changeDateDialog = {
        show: useSelector((state: ClientState) => state.changeDateDialog.show),
        storyId: useSelector((state: ClientState) => state.changeDateDialog.storyId),
        publishedAt: useSelector((state: ClientState) => state.changeDateDialog.publishedAt)
    }
    const showSourceDialog = useSelector((state: ClientState) => state.sourceDialog.show);
    const showLightBox = useSelector(isLightBoxShown);
    const showImageEditDialog = useSelector((state: ClientState) => state.imageEditDialog.show);
    const showDonateDialog = useSelector((state: ClientState) => state.donateDialog.show);
    const showEntryCopyTextDialog = useSelector((state: ClientState) => state.entryCopyTextDialog.show);
    const showPeopleHideDialog = useSelector((state: ClientState) => state.peopleHideDialog.show);
    const showFriendGroupsDialog = useSelector((state: ClientState) => state.friendGroupsDialog.show);
    const askDialog = {
        show: useSelector((state: ClientState) => state.askDialog.show),
        nodeName: useSelector((state: ClientState) => state.askDialog.nodeName)
    }
    const showBlockDialog = useSelector((state: ClientState) => state.blockDialog.show);
    const showBlockingDetailsDialog = useSelector((state: ClientState) => state.blockingDetailsDialog.show);
    const showSheriffOrderDialog = useSelector((state: ClientState) => state.sheriffOrderDialog.show);
    const showSheriffOrderDetailsDialog = useSelector((state: ClientState) => state.sheriffOrderDetailsDialog.show);
    const showSignUpDialog = useSelector((state: ClientState) => state.signUpDialog.show);
    const showMnemonicDialog = useSelector((state: ClientState) => !!state.nodeName.mnemonic);
    const showQuickTips = useSelector((state: ClientState) => state.quickTips.show);
    const showMessageBox = useSelector((state: ClientState) => state.messageBox.show);
    const showConfirmBox = useSelector((state: ClientState) => state.confirmBox.show);
    const showFlashBox = useSelector((state: ClientState) => state.flashBox.show);
    const showProgressBox = useSelector((state: ClientState) => state.progressBox.show);
    const showShareDialog = useSelector((state: ClientState) => state.shareDialog.show);

    return (
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
                    {changeDateDialog.show &&
                        <ChangeDateDialog storyId={changeDateDialog.storyId}
                                          publishedAt={changeDateDialog.publishedAt}/>
                    }
                    {showSourceDialog && <SourceDialog/>}
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
                        {askDialog.show && <AskDialog nodeName={askDialog.nodeName}/>}
                    </Suspense>
                    <Suspense fallback={null}>
                        {showBlockDialog && <BlockDialog/>}
                    </Suspense>
                    {showBlockingDetailsDialog && <BlockingDetailsDialog/>}
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
}
