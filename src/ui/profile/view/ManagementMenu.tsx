import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getNodeRootLocation } from "state/node/selectors";
import { nodeNameUpdateDialog, registerNameDialog } from "state/nodename/actions";
import { DropdownMenu } from "ui/control";

type Props = ConnectedProps<typeof connector>;

const ManagementMenu = ({rootLocation, registerNameDialog, nodeNameUpdateDialog}: Props) => {
    const {t} = useTranslation();

    return (
        <DropdownMenu items={[
            {
                title: t("update-current-name"),
                href: `${rootLocation}/moera/profile?edit=true`,
                onClick: () => nodeNameUpdateDialog(false),
                show: true
            },
            {
                title: t("register-different-name"),
                href: `${rootLocation}/moera/profile?edit=true`,
                onClick: registerNameDialog,
                show: true
            },
            {
                title: t("transfer-existing-name"),
                href: `${rootLocation}/moera/profile?edit=true`,
                onClick: () => nodeNameUpdateDialog(true),
                show: true
            }
        ]}/>
    );
}

const connector = connect(
    (state: ClientState) => ({
        rootLocation: getNodeRootLocation(state)
    }),
    { registerNameDialog, nodeNameUpdateDialog }
);

export default connector(ManagementMenu);
