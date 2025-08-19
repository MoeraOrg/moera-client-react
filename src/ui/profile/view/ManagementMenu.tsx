import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { nodeNameUpdateDialog, registerNameDialog } from "state/nodename/actions";
import { DropdownMenu } from "ui/control";
import { REL_CURRENT } from "util/rel-node-name";

export default function ManagementMenu() {
    const dispatch = useDispatch();
    const {t} = useTranslation();

    return (
        <DropdownMenu items={[
            {
                title: t("update-current-name"),
                nodeName: REL_CURRENT,
                href: "/profile",
                onClick: () => dispatch(nodeNameUpdateDialog(false)),
                show: true
            },
            {
                title: t("register-different-name"),
                nodeName: REL_CURRENT,
                href: "/profile",
                onClick: () => dispatch(registerNameDialog()),
                show: true
            },
            {
                title: t("transfer-existing-name"),
                nodeName: REL_CURRENT,
                href: "/profile",
                onClick: () => dispatch(nodeNameUpdateDialog(true)),
                show: true
            }
        ]}/>
    );
}
