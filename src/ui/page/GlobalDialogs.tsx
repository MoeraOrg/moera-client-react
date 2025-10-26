import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';

import { ClientState } from "state/state";
import MessageBox from "ui/messagebox/MessageBox";
import ConfirmBox from "ui/confirmbox/ConfirmBox";
import FlashBox from "ui/flashbox/FlashBox";
import ProgressBox from "ui/progressbox/ProgressBox";

const ShareDialog = React.lazy(() => import("ui/sharedialog/ShareDialog"));
const MnemonicDialog = React.lazy(() => import("ui/profile/manage/MnemonicDialog"));

export default function GlobalDialogs() {
    const showMnemonicDialog = useSelector((state: ClientState) => !!state.nodeName.mnemonic);
    const showMessageBox = useSelector((state: ClientState) => state.messageBox.show);
    const showConfirmBox = useSelector((state: ClientState) => state.confirmBox.show);
    const showFlashBox = useSelector((state: ClientState) => state.flashBox.show);
    const showProgressBox = useSelector((state: ClientState) => state.progressBox.show);
    const showShareDialog = useSelector((state: ClientState) => state.shareDialog.show);

    return (
        <>
            <Suspense fallback={null}>
                {showShareDialog && <ShareDialog/>}
            </Suspense>
            {showMnemonicDialog && <MnemonicDialog/>}
            {showMessageBox && <MessageBox/>}
            {showConfirmBox && <ConfirmBox/>}
            {showFlashBox && <FlashBox/>}
            {showProgressBox && <ProgressBox/>}
        </>
    );
}
