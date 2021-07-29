import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { nodeNameUpdateDialog, registerNameDialog } from "state/nodename/actions";
import { DropdownMenu } from "ui/control";
import { getNodeRootLocation } from "state/node/selectors";
import { ClientState } from "state/state";

type Props = ConnectedProps<typeof connector>;

const ManagementMenu = ({rootLocation, registerNameDialog, nodeNameUpdateDialog}: Props) => (
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

const connector = connect(
    (state: ClientState) => ({
        rootLocation: getNodeRootLocation(state)
    }),
    { registerNameDialog, nodeNameUpdateDialog }
);

export default connector(ManagementMenu);
