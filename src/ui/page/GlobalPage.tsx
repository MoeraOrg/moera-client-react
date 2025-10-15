import React from 'react';
import { useSelector } from 'react-redux';

import { ClientState } from "state/state";

const RemovalPage = React.lazy(() => import("ui/settings/RemovalPage"));
const GrantPage = React.lazy(() => import("ui/grant/GrantPage"));

export default function GlobalPage() {
    const page = useSelector((state: ClientState) => state.navigation.page);

    switch (page) {
        case "removal":
            return <RemovalPage/>;
        case "grant":
            return <GrantPage/>;
        default:
            return null;
    }
}
