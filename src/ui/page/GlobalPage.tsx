import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';

import { ClientState } from "state/state";
import "./GlobalPage.css";

const RemovalPage = React.lazy(() => import("ui/settings/RemovalPage"));
const GrantPage = React.lazy(() => import("ui/grant/GrantPage"));
const ConnectPage = React.lazy(() => import("ui/connectpage/ConnectPage"));
const SignUpPage = React.lazy(() => import("ui/signup/SignUpPage"));
const MnemonicPage = React.lazy(() => import("ui/profile/manage/MnemonicPage"));
const StartReadingPage = React.lazy(() => import("ui/explore/StartReadingPage"));

export default function GlobalPage() {
    const page = useSelector((state: ClientState) => state.navigation.page);

    switch (page) {
        case "removal":
            return (
                <Suspense fallback={null}>
                    <RemovalPage/>
                </Suspense>
            );
        case "grant":
            return (
                <Suspense fallback={null}>
                    <GrantPage/>
                </Suspense>
            );
        case "connect":
            return (
                <Suspense fallback={null}>
                    <ConnectPage/>
                </Suspense>
            );
        case "signup":
            return (
                <Suspense fallback={null}>
                    <SignUpPage/>
                </Suspense>
            );
        case "mnemonic":
            return (
                <Suspense fallback={null}>
                    <MnemonicPage/>
                </Suspense>
            );
        case "start-reading":
            return (
                <Suspense fallback={null}>
                    <StartReadingPage/>
                </Suspense>
            );
        default:
            return null;
    }
}
