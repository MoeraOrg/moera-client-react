import React from 'react';
import { connect } from 'react-redux';
import { nodeNameUpdateDialog, registerNameDialog } from "state/nodename/actions";
import { DropdownMenu } from "ui/control";
import { getNodeRootLocation } from "state/node/selectors";

const ManagementMenu = ({rootLocation, registerNameDialog, nodeNameUpdateDialog}) => (
    <DropdownMenu items={[
        {
            title: "Update the current name",
            href: `${rootLocation}/moera/profile?edit=true`,
            onClick: () => nodeNameUpdateDialog(false),
            show: true
        },
        {
            title: "Register a different name",
            href: `${rootLocation}/moera/profile?edit=true`,
            onClick: registerNameDialog,
            show: true
        },
        {
            title: "Transfer an existing name",
            href: `${rootLocation}/moera/profile?edit=true`,
            onClick: () => nodeNameUpdateDialog(true),
            show: true
        }
    ]}/>
);

export default connect(
    state => ({
        rootLocation: getNodeRootLocation(state)
    }),
    { registerNameDialog, nodeNameUpdateDialog }
)(ManagementMenu);
