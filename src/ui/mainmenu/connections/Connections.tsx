import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { Storage } from "storage";
import { ClientState } from "state/state";
import { getHomeRootLocation } from "state/home/selectors";
import { confirmBox } from "state/confirmbox/actions";
import { openConnectDialog } from "state/connectdialog/actions";
import { openSignUpDialog } from "state/signupdialog/actions";
import { Button, usePopover } from "ui/control";
import NodeName from "ui/nodename/NodeName";
import ConnectionItem from "ui/mainmenu/connections/ConnectionItem";
import "./Connections.css";

export default function Connections() {
    const location = useSelector(getHomeRootLocation);
    const login = useSelector((state: ClientState) => state.home.login);
    const owner = useSelector((state: ClientState) => state.home.owner);
    const roots = useSelector((state: ClientState) => state.home.roots);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const {hide} = usePopover();

    const onAddClick = () => {
        dispatch(openConnectDialog());
        hide();
    };

    const onSignUpClick = () => {
        dispatch(openSignUpDialog());
        hide();
    };

    const onItemClick = (location: string) => () => {
        Storage.switchData(location);
        hide();
    };

    const onDisconnect = (location: string) => () => {
        Storage.deleteData(location);
    };

    const onConfirmed = () => {
        if (location == null || login == null) {
            return;
        }
        Storage.deleteData(location);
    };

    const onDisconnectActive = () => {
        hide();
        dispatch(confirmBox(t("want-disconnect"), t("disconnect"), t("cancel"), onConfirmed, null, "danger"));
    }

    return (
        <div id="connections">
            {roots.map(root => (
                root.url === location ?
                    <div className="connection-item active" key={root.url}>
                        <div className="connection">
                            <NodeName name={owner.name} verified={owner.verified} correct={owner.correct}
                                      linked={false} popup={false}/><br/>
                            {location}<br/>
                            <span className="connected">{t("connected")}</span>
                        </div>
                        <div className="connection-buttons">
                            <div className="disconnect" title={t("disconnect")} onClick={onDisconnectActive}>
                                <FontAwesomeIcon icon={faSignOutAlt}/>
                            </div>
                        </div>
                    </div>
                :
                    <ConnectionItem key={root.url} name={root.name} url={root.url}
                                    onClick={onItemClick(root.url)}
                                    onDisconnect={onDisconnect(root.url)}/>
            ))}
            <div className="connection-add" onClick={onAddClick}>
                <FontAwesomeIcon icon={faPlus}/> {t("add-connection")}
            </div>
            <div className="connection-sign-up">
                <Button variant="outline-secondary" size="sm" onClick={onSignUpClick}>
                    {t("create-another-blog")}
                </Button>
            </div>
        </div>
    );
}
