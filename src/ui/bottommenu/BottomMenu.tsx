import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { Button, Loading } from "ui/control";
import QuickTipsButton from "ui/quicktips/QuickTipsButton";
import NewPostButton from "ui/mainmenu/connectionstatus/NewPostButton";
import NewsButton from "ui/mainmenu/connectionstatus/NewsButton";
import InstantButton from "ui/instant/InstantButton";
import SettingsButton from "ui/mainmenu/connectionstatus/SettingsButton";
import HomeButton from "ui/mainmenu/connectionstatus/HomeButton";
import { isAtNode } from "state/node/selectors";
import { isConnectedToHome } from "state/home/selectors";
import { isBottomMenuVisible } from "state/navigation/selectors";
import { openConnectDialog } from "state/connectdialog/actions";
import { openSignUpDialog } from "state/signupdialog/actions";
import { ClientState } from "state/state";
import "./BottomMenu.css";

type Props = ConnectedProps<typeof connector>;

function BottomMenu({atNode, connecting,  connected, visible, openConnectDialog, openSignUpDialog}: Props) {
    const {t} = useTranslation();
    const className = cx(["connection-status", "d-lg-none", "navbar-dark", "bg-dark"], {"invisible": !visible});

    if (connecting) {
        return (
            <div id="bottom-menu" className={className}>
                {t("connecting")} <Loading/>
            </div>
        );
    }

    if (!connected) {
        if (!atNode) {
            return null;
        }
        return (
            <div id="bottom-menu" className={className}>
                {t("not-connected-home")}
                <Button variant="primary" size="sm" onClick={() => openSignUpDialog()}>{t("sign-up")}</Button>
                <Button variant="success" size="sm" onClick={() => openConnectDialog()}>{t("connect")}</Button>
            </div>
        );
    }
    return (
        <div id="bottom-menu" className={className}>
            <NewPostButton/>
            <QuickTipsButton/>
            <SettingsButton/>
            <HomeButton/>
            <InstantButton/>
            <NewsButton/>
        </div>
    );
}

const connector = connect(
    (state: ClientState) => ({
        atNode: isAtNode(state),
        connecting: state.home.connecting,
        connected: isConnectedToHome(state),
        visible: isBottomMenuVisible(state)
    }),
    { openConnectDialog, openSignUpDialog }
);

export default connector(BottomMenu);
