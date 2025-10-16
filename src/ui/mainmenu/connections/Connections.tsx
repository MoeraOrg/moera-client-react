import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Storage } from "storage";
import { ClientState } from "state/state";
import { getHomeRootLocation } from "state/home/selectors";
import { confirmBox } from "state/confirmbox/actions";
import * as Browser from "ui/browser";
import { useParent } from "ui/hook";
import { Icon, msAdd } from "ui/material-symbols";
import Jump from "ui/navigation/Jump";
import NodeName from "ui/nodename/NodeName";
import { REL_HOME } from "util/rel-node-name";
import "./Connections.css";

interface Props {
    noActiveRoot?: boolean;
}

export default function Connections({noActiveRoot}: Props) {
    const location = useSelector(getHomeRootLocation);
    const login = useSelector((state: ClientState) => state.home.login);
    const owner = useSelector((state: ClientState) => state.home.owner);
    const roots = useSelector((state: ClientState) => state.home.roots);
    const activeRoot = roots.find(root => root.url === location);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const {hide} = useParent();

    const onActiveItemClick = (_: string, performJump: () => void) => {
        hide();
        performJump();
    };

    const onDisconnectConfirmed = () => {
        hide();
        if (location == null || login == null) {
            return;
        }
        Storage.deleteData(location);
    };

    const onDisconnect = () => {
        dispatch(confirmBox({
            message: t("want-disconnect"),
            yes: t("disconnect"),
            no: t("cancel"),
            onYes: onDisconnectConfirmed,
            variant: "danger"
        }));
    }

    const onItemClick = (location: string) => () => {
        Storage.switchData(location);
        hide();
    };

    const onAddClick = (_: string, performJump: () => void) => {
        hide();
        performJump();
    };

    return (
        <div id="connections">
            {activeRoot && !noActiveRoot &&
                <div className="connection-item active">
                    <Jump className="connection" nodeName={REL_HOME} href="/"
                          onNear={onActiveItemClick} onFar={onActiveItemClick}>
                        <NodeName name={owner.name} verified={owner.verified} correct={owner.correct}
                                  linked={false} popup={false}/>
                        <div className="location">{location}</div>
                        <div className="connected">{t("connected")}</div>
                    </Jump>
                    <div className="disconnect" onClick={onDisconnect}>{t("disconnect")}</div>
                </div>
            }
            {roots.filter(root => root.url !== location).map(root => (
                <div className="connection-item" key={root.url}>
                    <div className="connection" onClick={onItemClick(root.url)}>
                        {root.name ?
                            <NodeName name={root.name} linked={false} popup={false}/>
                        :
                            <div className="no-name">{t("no-name-known")}</div>
                        }
                        <div className="location">{root.url}</div>
                    </div>
                </div>
            ))}
            <Jump className="connection-add" href={Browser.urlWithBackHref("/connect")} onNear={onAddClick}>
                <Icon icon={msAdd}/> {t("add-connection")}
            </Jump>
        </div>
    );
}
