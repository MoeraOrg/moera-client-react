import React, { Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { nodeNameUpdateDialog, registerNameDialog } from "state/nodename/actions";
import { isNodeNameDefined, isNodeNameManageable, isNodeNameOperationPending } from "state/nodename/selectors";
import { DropdownMenu, MenuButton } from "ui/control";
import RegisterNameDialog from "ui/profile/manage/RegisterNameDialog";
import { REL_CURRENT } from "util/rel-node-name";
import "./ManagementMenu.css";

const NodeNameUpdateDialog = React.lazy(() => import("ui/profile/manage/NodeNameUpdateDialog"));

export default function ManagementMenu() {
    const manageable = useSelector(isNodeNameManageable);
    const nameDefined = useSelector(isNodeNameDefined);
    const operationPending = useSelector(isNodeNameOperationPending);
    const showRegisterNameDialog = useSelector((state: ClientState) => state.nodeName.showingRegisterDialog);
    const showNodeNameUpdateDialog = useSelector((state: ClientState) => state.nodeName.showingUpdateDialog);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    return (
        <>
            <DropdownMenu items={[
                {
                    title: t("update-current-name"),
                    nodeName: REL_CURRENT,
                    href: "/profile",
                    onClick: () => dispatch(nodeNameUpdateDialog(false)),
                    show: nameDefined && manageable && !operationPending
                },
                {
                    title: nameDefined ? t("register-different-name") : t("register-new-name"),
                    nodeName: REL_CURRENT,
                    href: "/profile",
                    onClick: () => dispatch(registerNameDialog()),
                    show: manageable && !operationPending
                },
                {
                    title: t("transfer-existing-name"),
                    nodeName: REL_CURRENT,
                    href: "/profile",
                    onClick: () => dispatch(nodeNameUpdateDialog(true)),
                    show: manageable && !operationPending
                }
            ]} className="management-menu">
                <MenuButton active/>
            </DropdownMenu>
            {showRegisterNameDialog && <RegisterNameDialog/>}
            {showNodeNameUpdateDialog &&
                <Suspense fallback={null}>
                    <NodeNameUpdateDialog/>
                </Suspense>
            }
        </>
    );
}
