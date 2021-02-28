import React from 'react';
import { connect } from 'react-redux';
import PropType from 'prop-types';

import { Button, Loading } from "ui/control";
import { isNodeNameDefined, isNodeNameManageable, isNodeNameOperationPending } from "state/nodename/selectors";
import { nodeNameUpdateDialog, registerNameDialog } from "state/nodename/actions";
import ManagementMenu from "ui/profile/view/ManagementMenu";
import OperationStatus from "ui/profile/view/OperationStatus";
import RegisterNameDialog from "ui/profile/manage/RegisterNameDialog";
import MnemonicDialog from "ui/profile/manage/MnemonicDialog";
import NodeNameUpdateDialog from "ui/profile/manage/NodeNameUpdateDialog";
import { mentionName } from "util/misc";
import "./NodeNameView.css";

const NodeNameView = ({loading, name, nameDefined, manageable, operationPending, registerNameDialog,
                       nodeNameUpdateDialog}) => (
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
                        <Button variant="primary" size="sm" disabled={operationPending} onClick={registerNameDialog}>
                            Register New Name
                        </Button>
                        <Button variant="outline-secondary" size="sm" disabled={operationPending}
                                style={{marginLeft: "1.5rem"}} onClick={() => nodeNameUpdateDialog(true)}>
                            Transfer Existing Name
                        </Button>
                    </>
                )
            }
            <Loading active={loading}/>
        </div>
        <RegisterNameDialog/>
        <MnemonicDialog/>
        <NodeNameUpdateDialog/>
    </>
);

NodeNameView.propTypes = {
    loading: PropType.bool,
    name: PropType.string,
    nameDefined: PropType.bool,
    manageable: PropType.bool,
    operationPending: PropType.bool
};

export default connect(
    state => ({
        loading: state.nodeName.loading,
        name: state.nodeName.name,
        nameDefined: isNodeNameDefined(state),
        manageable: isNodeNameManageable(state),
        operationPending: isNodeNameOperationPending(state)
    }),
    { registerNameDialog, nodeNameUpdateDialog }
)(NodeNameView);
