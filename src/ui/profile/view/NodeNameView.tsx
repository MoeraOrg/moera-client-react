import React, { Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Button, Loading } from "ui/control";
import {
    isNodeNameDefined,
    isNodeNameManageable,
    isNodeNameOperationPending,
    isNodeNameReady
} from "state/nodename/selectors";
import { nodeNameUpdateDialog, registerNameDialog } from "state/nodename/actions";
import { ClientState } from "state/state";
import { getOwnerName, isAtHomeNode } from "state/node/selectors";
import ManagementMenu from "ui/profile/view/ManagementMenu";
import OperationStatus from "ui/profile/view/OperationStatus";
import RegisterNameDialog from "ui/profile/manage/RegisterNameDialog";
import { mentionName } from "util/names";
import "./NodeNameView.css";

const NodeNameUpdateDialog = React.lazy(() => import("ui/profile/manage/NodeNameUpdateDialog"));

function NodeNameManagement() {
    const ready = useSelector(isNodeNameReady);
    const loading = useSelector((state: ClientState) => state.nodeName.loading);
    const manageable = useSelector(isNodeNameManageable);
    const nameDefined = useSelector(isNodeNameDefined);
    const operationPending = useSelector(isNodeNameOperationPending);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    if (!ready) {
        return loading && <Loading/>;
    }
    if (!manageable) {
        return null;
    }

    if (nameDefined) {
        return (
            <>
                {!operationPending && <ManagementMenu/>}
                <OperationStatus/>
            </>
        );
    } else {
        return (
            <>
                <Button variant="primary" size="sm" disabled={operationPending}
                        onClick={() => dispatch(registerNameDialog())}>
                    {t("register-new-name")}
                </Button>
                <Button variant="outline-secondary" size="sm" disabled={operationPending}
                        style={{marginLeft: "1.5rem"}} onClick={() => dispatch(nodeNameUpdateDialog(true))}>
                    {t("transfer-existing-name-button")}
                </Button>
            </>
        )
    }
}

export default function NodeNameView() {
    const atHomeNode = useSelector(isAtHomeNode);
    const name = useSelector(getOwnerName);
    const showRegisterNameDialog = useSelector((state: ClientState) => state.nodeName.showingRegisterDialog);
    const showNodeNameUpdateDialog = useSelector((state: ClientState) => state.nodeName.showingUpdateDialog);

    return (
        <>
            <div className="node-name-view">
                {name && <span className="name">{mentionName(name)}</span>}
                {atHomeNode && <NodeNameManagement/>}
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
