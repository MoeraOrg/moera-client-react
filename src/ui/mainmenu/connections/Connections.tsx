import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { disconnectFromHome } from "state/home/actions";
import { getHomeRootLocation } from "state/home/selectors";
import { confirmBox } from "state/confirmbox/actions";
import { openConnectDialog } from "state/connectdialog/actions";
import { openSignUpDialog } from "state/signupdialog/actions";
import { Browser } from "ui/browser";
import { Button } from "ui/control";
import NodeName from "ui/nodename/NodeName";
import ConnectionItem from "ui/mainmenu/connections/ConnectionItem";
import "./Connections.css";

type Props = {
    hide: () => void;
} & ConnectedProps<typeof connector>;

function Connections({
    hide, location, login, owner, roots, openConnectDialog, openSignUpDialog, confirmBox, disconnectFromHome
}: Props) {
    const {t} = useTranslation();

    const onAddClick = () => {
        openConnectDialog();
        hide();
    };

    const onSignUpClick = () => {
        openSignUpDialog();
        hide();
    };

    const onItemClick = (location: string) => () => {
        Browser.switchData(location);
        hide();
    };

    const onDisconnect = (location: string) => () => {
        Browser.deleteData(location);
    };

    const onConfirmed = () => {
        if (location == null || login == null) {
            return;
        }
        Browser.deleteData(location);
        disconnectFromHome(location, login);
    };

    const onDisconnectActive = () =>
        confirmBox(t("want-disconnect"), t("disconnect"), t("cancel"), onConfirmed, null, "danger");

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
                                <FontAwesomeIcon icon="sign-out-alt"/>
                            </div>
                        </div>
                    </div>
                :
                    <ConnectionItem key={root.url} name={root.name} url={root.url}
                                    onClick={onItemClick(root.url)}
                                    onDisconnect={onDisconnect(root.url)}/>
            ))}
            <div className="connection-add" onClick={onAddClick}>
                <FontAwesomeIcon icon="plus"/> {t("add-connection")}
            </div>
            <div className="connection-sign-up">
                <Button variant="outline-secondary" size="sm" onClick={onSignUpClick}>
                    {t("create-another-blog")}
                </Button>
            </div>
        </div>
    );
}

const connector = connect(
    (state: ClientState) => ({
        location: getHomeRootLocation(state),
        login: state.home.login,
        owner: state.home.owner,
        roots: state.home.roots
    }),
    { openConnectDialog, openSignUpDialog, confirmBox, disconnectFromHome }
);

export default connector(Connections);
