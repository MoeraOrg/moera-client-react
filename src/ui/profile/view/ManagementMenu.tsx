import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { nodeNameUpdateDialog, registerNameDialog } from "state/nodename/actions";
import { DropdownMenu } from "ui/control";

type Props = ConnectedProps<typeof connector>;

const ManagementMenu = ({registerNameDialog, nodeNameUpdateDialog}: Props) => {
    const {t} = useTranslation();

    return (
        <DropdownMenu items={[
            {
                title: t("update-current-name"),
                nodeName: "",
                href: "/profile?edit=true",
                onClick: () => nodeNameUpdateDialog(false),
                show: true
            },
            {
                title: t("register-different-name"),
                nodeName: "",
                href: "/profile?edit=true",
                onClick: registerNameDialog,
                show: true
            },
            {
                title: t("transfer-existing-name"),
                nodeName: "",
                href: "/profile?edit=true",
                onClick: () => nodeNameUpdateDialog(true),
                show: true
            }
        ]}/>
    );
}

const connector = connect(
    null,
    { registerNameDialog, nodeNameUpdateDialog }
);

export default connector(ManagementMenu);
