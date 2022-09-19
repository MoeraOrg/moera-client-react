import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from "react-i18next";

import { Button, Loading } from "ui/control";
import { isNodeNameDefined, isNodeNameManageable, isNodeNameOperationPending } from "state/nodename/selectors";
import { nodeNameUpdateDialog, registerNameDialog } from "state/nodename/actions";
import { ClientState } from "state/state";
import ManagementMenu from "ui/profile/view/ManagementMenu";
import OperationStatus from "ui/profile/view/OperationStatus";
import RegisterNameDialog from "ui/profile/manage/RegisterNameDialog";
import NodeNameUpdateDialog from "ui/profile/manage/NodeNameUpdateDialog";
import { mentionName } from "util/misc";
import "./NodeNameView.css";

type Props = ConnectedProps<typeof connector>;

const NodeNameView = ({loading, name, nameDefined, manageable, operationPending, registerNameDialog,
                       nodeNameUpdateDialog}: Props) => {
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
                <Loading active={loading}/>
            </div>
            <RegisterNameDialog/>
            <NodeNameUpdateDialog/>
        </>
    );
}

const connector = connect(
    (state: ClientState) => ({
        loading: state.nodeName.loading,
        name: state.nodeName.name,
        nameDefined: isNodeNameDefined(state),
        manageable: isNodeNameManageable(state),
        operationPending: isNodeNameOperationPending(state)
    }),
    { registerNameDialog, nodeNameUpdateDialog }
);

export default connector(NodeNameView);
