import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';

import { PrincipalValue } from "api";
import { ClientState } from "state/state";
import { getHomeFriendGroups, getHomeOwnerFullName, getHomeOwnerName } from "state/home/selectors";
import { getPosting } from "state/postings/selectors";
import { isLightBoxShown } from "state/lightbox/selectors";
import { getNodeCard } from "state/nodecards/selectors";
import { getSetting, getSettingNode } from "state/settings/selectors";
import ChangeDateDialog from "ui/changedatedialog/ChangeDateDialog";
import SourceDialog from "ui/sourcedialog/SourceDialog";
import EntryCopyTextDialog from "ui/entrycopytextdialog/EntryCopyTextDialog";
import BlockingDetailsDialog from "ui/blockingdetailsdialog/BlockingDetailsDialog";
import { NameDisplayMode } from "ui/types";

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
    const changeDateDialog = {
        show: useSelector((state: ClientState) => state.changeDateDialog.show),
        storyId: useSelector((state: ClientState) => state.changeDateDialog.storyId),
        publishedAt: useSelector((state: ClientState) => state.changeDateDialog.publishedAt)
    }
    const showSourceDialog = useSelector((state: ClientState) => state.sourceDialog.show);
    const showLightBox = useSelector(isLightBoxShown);
    const imageEditDialog = {
        show: useSelector((state: ClientState) => state.imageEditDialog.show),
        homeOwnerName: useSelector(getHomeOwnerName),
        homeOwnerFullName: useSelector(getHomeOwnerFullName),
        posting: useSelector((state: ClientState) => getPosting(state, state.imageEditDialog.media?.postingId ?? null)),
        smileysEnabled: useSelector((state: ClientState) => getSetting(state, "posting.smileys.enabled") as boolean)
    };
    const showDonateDialog = useSelector((state: ClientState) => state.donateDialog.show);
    const showEntryCopyTextDialog = useSelector((state: ClientState) => state.entryCopyTextDialog.show);
    const peopleHideDialog = {
        show: useSelector((state: ClientState) => state.peopleHideDialog.show),
        nodeName: useSelector((state: ClientState) => state.peopleHideDialog.nodeName),
        feedName: useSelector((state: ClientState) => state.peopleHideDialog.feedName),
        card: useSelector((state: ClientState) => getNodeCard(state, state.peopleHideDialog.nodeName)),
        subscribersHidden: useSelector((state: ClientState) =>
            (getSettingNode(state, "subscribers.view") as PrincipalValue ?? "public") === "admin"),
        subscriptionsHidden: useSelector((state: ClientState) =>
            (getSettingNode(state, "subscriptions.view") as PrincipalValue ?? "public") === "admin"),
        friendsHidden: useSelector((state: ClientState) =>
            (getSettingNode(state, "friends.view") as PrincipalValue ?? "public") === "admin")
    };
    const friendGroupsDialog = {
        show: useSelector((state: ClientState) => state.friendGroupsDialog.show),
        nodeName: useSelector((state: ClientState) => state.friendGroupsDialog.nodeName),
        nodeCard: useSelector((state: ClientState) => getNodeCard(state, state.friendGroupsDialog.nodeName)),
        availableGroups: useSelector(getHomeFriendGroups)
    };
    const askDialog = {
        show: useSelector((state: ClientState) => state.askDialog.show),
        nodeName: useSelector((state: ClientState) => state.askDialog.nodeName)
    }
    const blockDialog = {
        show: useSelector((state: ClientState) => state.blockDialog.show),
        nodeName: useSelector((state: ClientState) => state.blockDialog.nodeName),
        fullName: useSelector((state: ClientState) => state.blockDialog.fullName),
        entryNodeName: useSelector((state: ClientState) => state.blockDialog.entryNodeName),
        entryPostingId: useSelector((state: ClientState) => state.blockDialog.entryPostingId),
        prevBlocked: useSelector((state: ClientState) => state.blockDialog.prevBlocked),
        nameDisplayMode: useSelector((state: ClientState) => getSetting(state, "full-name.display")) as NameDisplayMode
    }
    const showBlockingDetailsDialog = useSelector((state: ClientState) => state.blockingDetailsDialog.show);
    const showSheriffOrderDialog = useSelector((state: ClientState) => state.sheriffOrderDialog.show);
    const showSheriffOrderDetailsDialog = useSelector((state: ClientState) => state.sheriffOrderDetailsDialog.show);

    return (
        <>
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
                {imageEditDialog.show &&
                    <ImageEditDialog homeOwnerName={imageEditDialog.homeOwnerName}
                                     homeOwnerFullName={imageEditDialog.homeOwnerFullName}
                                     posting={imageEditDialog.posting} smileysEnabled={imageEditDialog.smileysEnabled}/>
                }
            </Suspense>
            <Suspense fallback={null}>
                {showDonateDialog && <DonateDialog/>}
            </Suspense>
            {showEntryCopyTextDialog && <EntryCopyTextDialog/>}
            <Suspense fallback={null}>
                {peopleHideDialog.show &&
                    <PeopleHideDialog nodeName={peopleHideDialog.nodeName} feedName={peopleHideDialog.feedName}
                                      card={peopleHideDialog.card}
                                      subscribersHidden={peopleHideDialog.subscribersHidden}
                                      subscriptionsHidden={peopleHideDialog.subscriptionsHidden}
                                      friendsHidden={peopleHideDialog.friendsHidden}/>}
            </Suspense>
            <Suspense fallback={null}>
                {friendGroupsDialog.show &&
                    <FriendGroupsDialog nodeName={friendGroupsDialog.nodeName} nodeCard={friendGroupsDialog.nodeCard}
                                        availableGroups={friendGroupsDialog.availableGroups}/>
                }
            </Suspense>
            <Suspense fallback={null}>
                {askDialog.show && <AskDialog nodeName={askDialog.nodeName}/>}
            </Suspense>
            <Suspense fallback={null}>
                {blockDialog.show &&
                    <BlockDialog nodeName={blockDialog.nodeName} fullName={blockDialog.fullName}
                                 entryNodeName={blockDialog.entryNodeName} entryPostingId={blockDialog.entryPostingId}
                                 prevBlocked={blockDialog.prevBlocked} nameDisplayMode={blockDialog.nameDisplayMode}/>
                }
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
