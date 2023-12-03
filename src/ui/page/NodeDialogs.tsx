import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { isLightBoxShown } from "state/lightbox/selectors";
import ChangeDateDialog from "ui/changedatedialog/ChangeDateDialog";
import SourceDialog from "ui/sourcedialog/SourceDialog";
import EntryCopyTextDialog from "ui/entrycopytextdialog/EntryCopyTextDialog";
import BlockingDetailsDialog from "ui/blockingdetailsdialog/BlockingDetailsDialog";

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

export default function NodeDialogs() {
    const showReactionsDialog = useSelector((state: ClientState) => state.reactionsDialog.show);
    const showChangeDateDialog = useSelector((state: ClientState) => state.changeDateDialog.show);
    const showSourceDialog = useSelector((state: ClientState) => state.sourceDialog.show);
    const showLightBox = useSelector(isLightBoxShown);
    const showImageEditDialog = useSelector((state: ClientState) => state.imageEditDialog.show);
    const showDonateDialog = useSelector((state: ClientState) => state.donateDialog.show);
    const showEntryCopyTextDialog = useSelector((state: ClientState) => state.entryCopyTextDialog.show);
    const showPeopleHideDialog = useSelector((state: ClientState) => state.peopleHideDialog.show);
    const showFriendGroupsDialog = useSelector((state: ClientState) => state.friendGroupsDialog.show);
    const showAskDialog = useSelector((state: ClientState) => state.askDialog.show);
    const showBlockDialog = useSelector((state: ClientState) => state.blockDialog.show);
    const showBlockingDetailsDialog = useSelector((state: ClientState) => state.blockingDetailsDialog.show);
    const showSheriffOrderDialog = useSelector((state: ClientState) => state.sheriffOrderDialog.show);
    const showSheriffOrderDetailsDialog = useSelector((state: ClientState) => state.sheriffOrderDetailsDialog.show);

    return (
        <>
            <Suspense fallback={null}>
                {showReactionsDialog && <ReactionsDialog/>}
            </Suspense>
            {showChangeDateDialog && <ChangeDateDialog/>}
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
                {showAskDialog && <AskDialog/>}
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
    );
}
