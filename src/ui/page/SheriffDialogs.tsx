import React from 'react';
import { useSelector } from 'react-redux';

import { ClientState } from "state/state";
import AskDialog from "ui/askdialog/AskDialog";
import SheriffOrderDialog from "ui/sherifforderdialog/SheriffOrderDialog";
import SheriffOrderDetailsDialog from "ui/sherifforderdetailsdialog/SheriffOrderDetailsDialog";

export default function SheriffDialogs() {
    const showAskDialog = useSelector((state: ClientState) => state.askDialog.show);
    const showSheriffOrderDialog = useSelector((state: ClientState) => state.sheriffOrderDialog.show);
    const showSheriffOrderDetailsDialog = useSelector((state: ClientState) => state.sheriffOrderDetailsDialog.show);

    return (
        <>
            {showAskDialog && <AskDialog/>}
            {showSheriffOrderDialog && <SheriffOrderDialog/>}
            {showSheriffOrderDetailsDialog && <SheriffOrderDetailsDialog/>}
        </>
    );
}
