import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

import { NodeName } from "api";
import { getHomeOwnerAvatar, getHomeOwnerFullName, getHomeOwnerName } from "state/home/selectors";
import { Avatar, OnlyDesktop } from "ui/control";
import { Icon, MaterialSymbol, msExplore, msPublic, msReport, msSettings } from "ui/material-symbols";
import Jump from "ui/navigation/Jump";
import { useMainMenuHomeNews } from "ui/mainmenu/pages/main-menu";
import { getFeedTitle } from "ui/feed/feeds";
import { REL_HOME } from "util/rel-node-name";
import "./MainMenuSidebar.css";
import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";

type MainMenuSidebarItem = "news" | "explore" | "settings" | "complaints";

interface MenuItem {
    value: MainMenuSidebarItem;
    icon: MaterialSymbol;
    title: string;
    href: string;
    visible?: boolean;
}

interface Props {
    selected?: MainMenuSidebarItem;
}

export default function MainMenuSidebar({selected}: Props) {
    const ownerName = useSelector(getHomeOwnerName);
    const ownerFullName = useSelector(getHomeOwnerFullName);
    const avatar = useSelector(getHomeOwnerAvatar);
    const newsHref = useMainMenuHomeNews().href;
    const {t} = useTranslation();

    const MENU_TABS = useMemo<MenuItem[]>(() => [
        {
            value: "news",
            icon: msPublic,
            title: getFeedTitle("news", t),
            href: newsHref
        },
        {
            value: "explore",
            icon: msExplore,
            title: t("explore"),
            href: "/explore"
        },
        {
            value: "settings",
            icon: msSettings,
            title: t("settings"),
            href: "/settings"
        },
        {
            value: "complaints",
            icon: msReport,
            title: t("complaints"),
            href: "/complaints",
            visible: ownerName === SHERIFF_GOOGLE_PLAY_TIMELINE
        },
    ], [newsHref, ownerName, t]);

    if (!ownerName) {
        return null;
    }

    return (
        <OnlyDesktop>
            <div id="main-menu-sidebar">
                <ul className="nav nav-pills flex-column">
                    <li className="nav-item">
                        <Jump className="nav-link" nodeName={REL_HOME} href="/">
                            <Avatar className="icon" avatar={avatar} ownerName={ownerName} size={24}
                                    nodeName={REL_HOME}/>
                            {ownerFullName || NodeName.shorten(ownerName)}
                        </Jump>
                    </li>
                    <hr/>
                    {MENU_TABS.filter(item => item.visible ?? true).map(item => (
                        <li className="nav-item" key={item.value}>
                            <Jump className={cx("nav-link", {"active": selected === item.value})} nodeName={REL_HOME}
                                  href={item.href}>
                                <Icon className="icon" icon={item.icon} size={24}/>
                                {item.title}
                            </Jump>
                        </li>
                    ))}
                </ul>
            </div>
        </OnlyDesktop>
    );
}
