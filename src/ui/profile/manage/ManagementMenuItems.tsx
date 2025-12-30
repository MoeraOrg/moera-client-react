import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { nodeNameUpdateDialog, registerNameDialog } from "state/nodename/actions";
import { isNodeNameDefined, isNodeNameManageable, isNodeNameOperationPending } from "state/nodename/selectors";
import { isProfileEditable } from "state/profile/selectors";
import { shareDialogPrepare, sharePageCopyLink } from "state/sharedialog/actions";
import { DropdownMenuItems } from "ui/control";
import { useIsTinyScreen } from "ui/hook";
import { REL_CURRENT } from "util/rel-node-name";

export default function ManagementMenuItems() {
    const manageable = useSelector(isNodeNameManageable);
    const nameDefined = useSelector(isNodeNameDefined);
    const operationPending = useSelector(isNodeNameOperationPending);
    const profileEditable = useSelector(isProfileEditable);
    const tinyScreen = useIsTinyScreen();
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onCopyLink = () => dispatch(sharePageCopyLink(REL_CURRENT, "/"));

    const onShare = () => dispatch(shareDialogPrepare(REL_CURRENT, "/"));

    return (
        <DropdownMenuItems
            items={[
                {
                    title: t("update-current-name"),
                    nodeName: REL_CURRENT,
                    href: "/",
                    onClick: () => dispatch(nodeNameUpdateDialog(false)),
                    show: nameDefined && manageable && !operationPending
                },
                {
                    title: nameDefined ? t("register-different-name") : t("register-new-name"),
                    nodeName: REL_CURRENT,
                    href: "/",
                    onClick: () => dispatch(registerNameDialog()),
                    show: manageable && !operationPending
                },
                {
                    title: t("transfer-existing-name"),
                    nodeName: REL_CURRENT,
                    href: "/",
                    onClick: () => dispatch(nodeNameUpdateDialog(true)),
                    show: manageable && !operationPending
                },
                {
                    divider: true
                },
                {
                    title: t("copy-link"),
                    nodeName: REL_CURRENT,
                    href: "/",
                    onClick: onCopyLink,
                    show: true
                },
                {
                    title: t("share"),
                    nodeName: REL_CURRENT,
                    href: "/",
                    onClick: onShare,
                    show: true
                },
                {
                    divider: true
                },
                {
                    title: t("edit-profile"),
                    nodeName: REL_CURRENT,
                    href: "/settings/profile",
                    show: profileEditable
                },
                {
                    divider: true
                },
                {
                    title: t("search"),
                    nodeName: REL_CURRENT,
                    href: "/search",
                    show: tinyScreen
                },
            ]}
        />
    );
}
