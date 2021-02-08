import React from 'react';
import { connect } from 'react-redux';
import PropType from 'prop-types';

import { Button, Loading } from "ui/control";
import NodeName from "ui/nodename/NodeName";
import {
    isNodeNameDefined,
    isNodeNameManageable,
    isNodeNameOperationPending
} from "state/nodename/selectors";
import OperationStatus from "ui/profile/view/OperationStatus";
import { nodeNameUpdateDialog, registerNameDialog } from "state/nodename/actions";
import RegisterNameDialog from "ui/profile/manage/RegisterNameDialog";
import MnemonicDialog from "ui/profile/manage/MnemonicDialog";
import NodeNameUpdateDialog from "ui/profile/manage/NodeNameUpdateDialog";

const ManagementButtonsImpl = ({nameDefined, operationPending, registerNameDialog, nodeNameUpdateDialog}) => (
    <div className="col-sm-9">
        {nameDefined &&
            <Button variant="secondary" size="sm" disabled={operationPending} style={{marginRight: "0.2rem"}}
                    onClick={() => nodeNameUpdateDialog(false)}>
                Update
            </Button>
        }
        <Button variant={!nameDefined ? "primary" : "secondary"} size="sm" disabled={operationPending}
                onClick={registerNameDialog}>
            Register {!nameDefined ? "New" : "Another"}
        </Button>
        <Button variant="outline-secondary" size="sm" disabled={operationPending} style={{marginLeft: "1.5rem"}}
                onClick={() => nodeNameUpdateDialog(true)}>
            Transfer Name
        </Button>
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
                    <NodeName name={name} linked={false} popup={false}/>
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
