import React, { Suspense } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Button, Loading } from "ui/control";
import { isNodeNameDefined, isNodeNameManageable, isNodeNameOperationPending } from "state/nodename/selectors";
import { nodeNameUpdateDialog, registerNameDialog } from "state/nodename/actions";
import { ClientState } from "state/state";
import ManagementMenu from "ui/profile/view/ManagementMenu";
import OperationStatus from "ui/profile/view/OperationStatus";
import { mentionName } from "util/misc";
import "./NodeNameView.css";

const RegisterNameDialog = React.lazy(() => import("ui/profile/manage/RegisterNameDialog"));
const NodeNameUpdateDialog = React.lazy(() => import( "ui/profile/manage/NodeNameUpdateDialog"));

type Props = ConnectedProps<typeof connector>;

const NodeNameView = ({
    loading, name, nameDefined, manageable, operationPending, showRegisterNameDialog, showNodeNameUpdateDialog,
    registerNameDialog, nodeNameUpdateDialog
}: Props) => {
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
                                    onClick={registerNameDialog}>
                                {t("register-new-name")}
                            </Button>
                            <Button variant="outline-secondary" size="sm" disabled={operationPending}
                                    style={{marginLeft: "1.5rem"}} onClick={() => nodeNameUpdateDialog(true)}>
                                {t("transfer-existing-name-button")}
                            </Button>
                        </>
                    )
                }
                {loading && <Loading/>}
            </div>
            {showRegisterNameDialog &&
                <Suspense fallback={null}>
                    <RegisterNameDialog/>
                </Suspense>
            }
            {showNodeNameUpdateDialog &&
                <Suspense fallback={null}>
                    <NodeNameUpdateDialog/>
                </Suspense>
            }
        </>
    );
}

const connector = connect(
    (state: ClientState) => ({
        loading: state.nodeName.loading,
        name: state.nodeName.name,
        nameDefined: isNodeNameDefined(state),
        manageable: isNodeNameManageable(state),
        operationPending: isNodeNameOperationPending(state),
        showRegisterNameDialog: state.nodeName.showingRegisterDialog,
        showNodeNameUpdateDialog: state.nodeName.showingUpdateDialog
    }),
    { registerNameDialog, nodeNameUpdateDialog }
);

export default connector(NodeNameView);
