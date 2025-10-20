import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';

import { ClientState } from "state/state";

const RemovalPage = React.lazy(() => import("ui/settings/RemovalPage"));
const GrantPage = React.lazy(() => import("ui/grant/GrantPage"));
const ConnectPage = React.lazy(() => import("ui/connectpage/ConnectPage"));

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
        default:
            return null;
    }
}
