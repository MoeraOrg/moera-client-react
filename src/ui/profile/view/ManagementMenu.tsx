import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { nodeNameUpdateDialog, registerNameDialog } from "state/nodename/actions";
import { DropdownMenu } from "ui/control";

export default function ManagementMenu() {
    const dispatch = useDispatch();
    const {t} = useTranslation();

    return (
        <DropdownMenu items={[
            {
                title: t("update-current-name"),
                nodeName: "",
                href: "/profile?edit=true",
                onClick: () => dispatch(nodeNameUpdateDialog(false)),
                show: true
            },
            {
                title: t("register-different-name"),
                nodeName: "",
                href: "/profile?edit=true",
                onClick: () => dispatch(registerNameDialog()),
                show: true
            },
            {
                title: t("transfer-existing-name"),
                nodeName: "",
                href: "/profile?edit=true",
                onClick: () => dispatch(nodeNameUpdateDialog(true)),
                show: true
            }
        ]}/>
    );
}
