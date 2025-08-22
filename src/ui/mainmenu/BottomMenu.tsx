import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isAtNode } from "state/node/selectors";
import { isConnectedToHome } from "state/home/selectors";
import { isBottomMenuVisible } from "state/navigation/selectors";
import { openConnectDialog } from "state/connectdialog/actions";
import { openSignUpDialog } from "state/signupdialog/actions";
import { Button, Loading } from "ui/control";
import { useActiveElement, useIsTinyScreen } from "ui/hook";
import NewPostButton from "ui/mainmenu/connectionstatus/NewPostButton";
import NewsButton from "ui/mainmenu/connectionstatus/NewsButton";
import InstantButton from "ui/instant/InstantButton";
import SettingsButton from "ui/mainmenu/connectionstatus/SettingsButton";
import HomeButton from "ui/mainmenu/connectionstatus/HomeButton";
import "ui/mainmenu/BottomMenu.css";

export default function BottomMenu() {
    const atNode = useSelector(isAtNode);
    const connecting = useSelector((state: ClientState) => state.home.connecting);
    const connected = useSelector(isConnectedToHome);
    const bottomMenuVisible = useSelector(isBottomMenuVisible);
    const activeElement = useActiveElement();
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const tinyScreen = useIsTinyScreen();

    if (!tinyScreen) {
        return null;
    }

    const invisible = !bottomMenuVisible
        || activeElement?.tagName === "TEXTAREA"
        || activeElement?.classList.contains("visual-text-area");

    const className = cx(["connection-status", "navbar-dark", "bg-dark"], {invisible});

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

        const onSignUp = () => dispatch(openSignUpDialog());
        const onConnect = () => dispatch(openConnectDialog());

        return (
            <div id="bottom-menu" className={className}>
                {t("not-connected-home")}
                <Button variant="primary" size="sm" onClick={onSignUp}>{t("sign-up")}</Button>
                <Button variant="success" size="sm" onClick={onConnect}>{t("connect")}</Button>
            </div>
        );
    }

    return (
        <div id="bottom-menu" className={className}>
            <NewPostButton/>
            <SettingsButton/>
            <HomeButton/>
            <InstantButton/>
            <NewsButton/>
        </div>
    );
}
