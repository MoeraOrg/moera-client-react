import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { DropdownMenu, MenuButton } from "ui/control";
import ManagementMenuItems from "ui/profile/manage/ManagementMenuItems";
import RegisterNameDialog from "ui/profile/manage/RegisterNameDialog";
import "./ManagementMenu.css";

const NodeNameUpdateDialog = React.lazy(() => import("ui/profile/manage/NodeNameUpdateDialog"));

export default function ManagementMenu() {
    const showRegisterNameDialog = useSelector((state: ClientState) => state.nodeName.showingRegisterDialog);
    const showNodeNameUpdateDialog = useSelector((state: ClientState) => state.nodeName.showingUpdateDialog);

    return (
        <>
            <DropdownMenu
                content={<ManagementMenuItems/>}
                menuContainer={document.getElementById("modal-root")}
                className="management-menu"
            >
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
