import React from 'react';
import { connect } from 'react-redux';
import PropType from 'prop-types';

import { Button, Loading, NodeName } from "ui/control";
import {
    isNodeNameDefined,
    isNodeNameManageable,
    isNodeNameOperationPending
} from "state/nodename/selectors";
import Expiration from "ui/profile/view/Expiration";
import OperationStatus from "ui/profile/view/OperationStatus";
import { nodeNameUpdateDialog, registerNameDialog } from "state/nodename/actions";
import RegisterNameDialog from "ui/profile/manage/RegisterNameDialog";
import MnemonicDialog from "ui/profile/manage/MnemonicDialog";
import NodeNameUpdateDialog from "ui/profile/manage/NodeNameUpdateDialog";

const ManagementButtonsImpl = ({nameDefined, operationPending, registerNameDialog, nodeNameUpdateDialog}) => (
    <div className="col-sm-9">
        <Button variant="outline-secondary" size="sm" disabled={operationPending}
                onClick={e => nodeNameUpdateDialog(true)}>
            Change
        </Button>
        <Button variant={!nameDefined ? "primary" : "outline-secondary"} size="sm" disabled={operationPending}
                style={{marginLeft: "0.2rem"}} onClick={registerNameDialog}>
            Register New
        </Button>
        {nameDefined &&
            <Button variant="primary" size="sm" disabled={operationPending} style={{marginLeft: "0.2rem"}}
                    onClick={e => nodeNameUpdateDialog(false)}>
                Prolong
            </Button>
        }
    </div>
);

const ManagementButtons = connect(
    state => ({
        nameDefined: isNodeNameDefined(state),
        operationPending: isNodeNameOperationPending(state)
    }),
    { registerNameDialog, nodeNameUpdateDialog }
)(ManagementButtonsImpl);

const NodeNameView = ({loading, name, manageable}) => (
    <>
        <h4>
            Node Name <Loading active={loading}/>
        </h4>
        <div className="row">
            {name &&
                <div className="col-sm-3">
                    <NodeName name={name} linked={false}/>
                    {manageable && <Expiration/>}
                </div>
            }
            {manageable && <ManagementButtons/>}
        </div>
        {manageable && <OperationStatus/>}
        <RegisterNameDialog/>
        <MnemonicDialog/>
        <NodeNameUpdateDialog/>
    </>
);

NodeNameView.propTypes = {
    loading: PropType.bool,
    name: PropType.string,
    manageable: PropType.bool
};

export default connect(
    state => ({
        loading: state.nodeName.loading,
        name: state.nodeName.name,
        manageable: isNodeNameManageable(state)
    })
)(NodeNameView);
