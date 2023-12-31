import React, { Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Button, Loading } from "ui/control";
import { isNodeNameDefined, isNodeNameManageable, isNodeNameOperationPending } from "state/nodename/selectors";
import { nodeNameUpdateDialog, registerNameDialog } from "state/nodename/actions";
import { ClientState } from "state/state";
import ManagementMenu from "ui/profile/view/ManagementMenu";
import OperationStatus from "ui/profile/view/OperationStatus";
import RegisterNameDialog from "ui/profile/manage/RegisterNameDialog";
import { mentionName } from "util/names";
import "./NodeNameView.css";

const NodeNameUpdateDialog = React.lazy(() => import("ui/profile/manage/NodeNameUpdateDialog"));

export default function NodeNameView() {
    const loading = useSelector((state: ClientState) => state.nodeName.loading);
    const name = useSelector((state: ClientState) => state.nodeName.name);
    const nameDefined = useSelector(isNodeNameDefined);
    const manageable = useSelector(isNodeNameManageable);
    const operationPending = useSelector(isNodeNameOperationPending);
    const showRegisterNameDialog = useSelector((state: ClientState) => state.nodeName.showingRegisterDialog);
    const showNodeNameUpdateDialog = useSelector((state: ClientState) => state.nodeName.showingUpdateDialog);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    return (
        <>
            <div className="node-name-view">
                {nameDefined ?
                    <>
                        {name && <span className="name">{mentionName(name)}</span>}
                        {manageable && !operationPending && <ManagementMenu/>}
                        {manageable && <OperationStatus/>}
                    </>
                    :
                    (manageable &&
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
                {loading && <Loading/>}
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
