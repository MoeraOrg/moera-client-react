import React from 'react';
import { useSelector } from 'react-redux';

import { ClientState } from "state/state";
import ComplainsListPage from "ui/complains/ComplainsListPage";
import ComplainDetailsPage from "ui/complains/ComplainDetailsPage";
import "./ComplainsListPage.css";

export default function ComplainsPage() {
    const activeComplainGroupId = useSelector((state: ClientState) => state.complains.activeComplainGroupId);

    if (activeComplainGroupId == null) {
        return <ComplainsListPage/>;
    } else {
        return <ComplainDetailsPage/>;
    }
}
