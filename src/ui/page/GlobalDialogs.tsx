import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';

import { ClientState } from "state/state";
import MnemonicDialog from "ui/profile/manage/MnemonicDialog";
import MessageBox from "ui/messagebox/MessageBox";
import ConfirmBox from "ui/confirmbox/ConfirmBox";
import FlashBox from "ui/flashbox/FlashBox";
import ProgressBox from "ui/progressbox/ProgressBox";

const ConnectDialog = React.lazy(() => import("ui/connectdialog/ConnectDialog"));
const SignUpDialog = React.lazy(() => import("ui/signupdialog/SignUpDialog"));
const ShareDialog = React.lazy(() => import("ui/sharedialog/ShareDialog"));

export default function GlobalDialogs() {
    const showSignUpDialog = useSelector((state: ClientState) => state.signUpDialog.show);
    const showConnectDialog = useSelector((state: ClientState) =>
        state.connectDialog.show && !state.messageBox.show && !state.home.connecting
    );
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
            <Suspense fallback={null}>
                {showSignUpDialog && <SignUpDialog/>}
            </Suspense>
            <Suspense fallback={null}>
                {showConnectDialog &&
                    <ConnectDialog/>
                }
            </Suspense>
            {showMnemonicDialog && <MnemonicDialog/>}
            {showMessageBox && <MessageBox/>}
            {showConfirmBox && <ConfirmBox/>}
            {showFlashBox && <FlashBox/>}
            {showProgressBox && <ProgressBox/>}
        </>
    );
}
