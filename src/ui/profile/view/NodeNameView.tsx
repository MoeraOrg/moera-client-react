import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { getOwnerName } from "state/node/selectors";
import RegisterNameDialog from "ui/profile/manage/RegisterNameDialog";
import { mentionName } from "util/names";
import "./NodeNameView.css";

const NodeNameUpdateDialog = React.lazy(() => import("ui/profile/manage/NodeNameUpdateDialog"));

export default function NodeNameView() {
    const name = useSelector(getOwnerName);
    const showRegisterNameDialog = useSelector((state: ClientState) => state.nodeName.showingRegisterDialog);
    const showNodeNameUpdateDialog = useSelector((state: ClientState) => state.nodeName.showingUpdateDialog);

    return (
        <>
            <div className="node-name-view">
                {name && <span className="name">{mentionName(name)}</span>}
            </div>
            {showRegisterNameDialog && <RegisterNameDialog/>}
            {showNodeNameUpdateDialog &&
                <Suspense fallback={null}>
                    <NodeNameUpdateDialog/>
                </Suspense>
            }
        </>
    );
}
