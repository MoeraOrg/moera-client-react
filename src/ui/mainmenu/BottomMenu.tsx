import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isAtHomeNode, isAtNode } from "state/node/selectors";
import { getHomeOwnerAvatar, getHomeOwnerName, isConnectedToHome } from "state/home/selectors";
import {
    isAtInstantsPage,
    isAtNewsPage,
    isBottomMenuVisible,
    isInExplorePages,
    isInProfilePages
} from "state/navigation/selectors";
import { getSetting } from "state/settings/selectors";
import { getInstantCount, getNewsCount } from "state/feeds/selectors";
import { Icon, msAdd, msExplore, msNotifications, msPublic } from "ui/material-symbols";
import { Avatar } from "ui/control";
import { useIsTinyScreen, useVirtualKeyboard } from "ui/hook";
import Jump from "ui/navigation/Jump";
import { getFeedTitle, useHomeNews } from "ui/feed/feeds";
import InvitationAlert from "ui/mainmenu/InvitationAlert";
import { REL_HOME } from "util/rel-node-name";
import "./BottomMenu.css";

export default function BottomMenu() {
    const atNode = useSelector(isAtNode);
    const connecting = useSelector((state: ClientState) => state.home.connecting);
    const connected = useSelector(isConnectedToHome);
    const ownerName = useSelector(getHomeOwnerName);
    const avatar = useSelector(getHomeOwnerAvatar);
    const menuStyle = useSelector((state: ClientState) => getSetting(state, "bottom-menu.style") as string);

    const atNews = useSelector(isAtNewsPage);
    const newsHref = useHomeNews();
    const newsCount = useSelector(getNewsCount);

    const inExplore = useSelector(isInExplorePages);
    const exploreRinging = useSelector((state: ClientState) =>
        getSetting(state, "explore.discussions.ringing") as boolean
    );

    const atInstants = useSelector(isAtInstantsPage);
    const instantCount = useSelector(getInstantCount);
    const inHomeProfile = useSelector((state: ClientState) => isAtHomeNode(state) && isInProfilePages(state));

    const bottomMenuVisible = useSelector(isBottomMenuVisible);
    const {open: keyboardOpen} = useVirtualKeyboard();
    const {t} = useTranslation();

    const tinyScreen = useIsTinyScreen();

    if (!tinyScreen) {
        return null;
    }

    if (!connected) {
        if (!atNode || connecting) {
            return null;
        }

        return <InvitationAlert/>;
    }

    const invisible = !bottomMenuVisible || keyboardOpen;

    return (
        <footer id="bottom-menu" className={cx({invisible}, menuStyle)}>
            <Jump nodeName={REL_HOME} href={newsHref} className="item">
                <div className={cx("icon", "news", {active: atNews})}>
                    <Icon icon={msPublic} size={20}/>
                    {newsCount > 0 && <div className="count">{newsCount}</div>}
                </div>
                <div className="title">{getFeedTitle("news", t)}</div>
            </Jump>
            <Jump nodeName={REL_HOME} href={!exploreRinging ? "/explore" : "/explore/discussions"} className="item">
                <div className={cx("icon", "explore", {active: inExplore})}>
                    <Icon icon={msExplore} size={20}/>
                    {exploreRinging && <div className="count">{" "}</div>}
                </div>
                <div className="title">{t("explore")}</div>
            </Jump>
            <Jump nodeName={REL_HOME} href="/compose" className="new-post">
                <Icon icon={msAdd} size={24}/>
            </Jump>
            <Jump nodeName={REL_HOME} href="/instants" className="item">
                <div className={cx("icon", "bell", {active: atInstants})}>
                    <Icon icon={msNotifications} size={20}/>
                    {instantCount > 0 && <div className="count">{instantCount}</div>}
                </div>
                <div className="title">{t("instants")}</div>
            </Jump>
            <Jump nodeName={REL_HOME} href="/" className="item">
                <div className={cx("icon", {active: inHomeProfile})}>
                    <Avatar avatar={avatar} ownerName={ownerName} size={20} nodeName={REL_HOME}/>
                </div>
                <div className="title">{t("profile")}</div>
            </Jump>
        </footer>
    );
}
