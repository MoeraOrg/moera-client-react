import React, { ForwardedRef, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { NodeName } from "api";
import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { tTitle } from "i18n";
import { Storage } from "storage";
import { ClientState } from "state/state";
import { getHomeOwnerAvatar, getHomeOwnerFullName, getHomeOwnerName, getHomeRootLocation } from "state/home/selectors";
import { confirmBox } from "state/confirmbox/actions";
import { Avatar } from "ui/control";
import { Icon, msLogout, msReport, msSwapHoriz } from "ui/material-symbols";
import { useParent } from "ui/hook";
import Jump from "ui/navigation/Jump";
import { REL_HOME } from "util/rel-node-name";
import "./SandwichMenu.css";

interface Props {
}

function SandwichMenu(_: Props, ref: ForwardedRef<HTMLDivElement>) {
    const nodeName = useSelector(getHomeOwnerName);
    const fullName = useSelector(getHomeOwnerFullName);
    const avatar = useSelector(getHomeOwnerAvatar);
    const location = useSelector(getHomeRootLocation);
    const login = useSelector((state: ClientState) => state.home.login);
    const {hide} = useParent();
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onJump = (_: string, performJump: () => void) => {
        hide();
        performJump();
    }

    const onDisconnectConfirmed = () => {
        if (location == null || login == null) {
            return;
        }
        Storage.deleteData(location);
    };

    const onDisconnect = () => {
        hide();
        dispatch(confirmBox({
            message: t("want-disconnect"),
            yes: t("disconnect"),
            no: t("cancel"),
            onYes: onDisconnectConfirmed,
            variant: "danger"
        }));
    }

    return (
        <div className="offcanvas-body sandwich-menu" ref={ref}>
            {nodeName &&
                <>
                    <Jump nodeName={REL_HOME} href="/" className="profile" onNear={onJump} onFar={onJump}>
                        <Avatar avatar={avatar} ownerName={nodeName} size={40}/>
                        <div className="full-name">
                            {fullName || NodeName.shorten(nodeName)}
                        </div>
                        <div className="name">{NodeName.shorten(nodeName)}</div>
                    </Jump>
                    {nodeName === SHERIFF_GOOGLE_PLAY_TIMELINE &&
                        <>
                            <hr/>
                            <Jump nodeName={REL_HOME} href="/complaints" className="item">
                                <Icon icon={msReport} size={24}/>
                                <span>{tTitle(t("complaints"))}</span>
                            </Jump>
                        </>
                    }
                    <hr/>
                    <div className="item">
                        <Icon icon={msSwapHoriz} size={24}/>
                        <span>{tTitle(t("switch-accounts"))}</span>
                    </div>
                    <div className="item" onClick={onDisconnect}>
                        <Icon icon={msLogout} size={24}/>
                        <span>{tTitle(t("disconnect"))}</span>
                    </div>
                </>
            }
        </div>
    );
}

export default forwardRef(SandwichMenu);
