import React from 'react';
import { useSelector } from 'react-redux';

import { ClientState } from "state/state";
import ComplaintsListPage from "ui/complaints/ComplaintsListPage";
import ComplaintDetailsPage from "ui/complaints/ComplaintDetailsPage";

export default function ComplaintsPage() {
    const activeComplaintGroupId = useSelector((state: ClientState) => state.complaints.activeComplaintGroupId);

    if (activeComplaintGroupId == null) {
        return <ComplaintsListPage/>;
    } else {
        return <ComplaintDetailsPage/>;
    }
}
