import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

import { NodeName } from "api";
import { ClientState } from "state/state";
import { isAtHomeNode } from "state/node/selectors";
import { getHomeOwnerAvatar, getHomeOwnerFullName, getHomeOwnerName } from "state/home/selectors";
import { isAtNewsPage, isAtSettingsPage, isInExplorePages, isInProfilePages } from "state/navigation/selectors";
import { Avatar, OnlyDesktop } from "ui/control";
import { Icon, MaterialSymbol, msExplore, msPublic, msSettings } from "ui/material-symbols";
import Jump from "ui/navigation/Jump";
import NewsCounter from "ui/mainmenu/NewsCounter";
import { getFeedTitle, useHomeNews } from "ui/feed/feeds";
import { REL_HOME } from "util/rel-node-name";
import "./MainMenuSidebar.css";

type MainMenuSidebarItem = "news" | "explore" | "settings";

interface MenuItem {
    value: MainMenuSidebarItem;
    icon: MaterialSymbol;
    title: string;
    href: string;
    active: boolean;
}

export default function MainMenuSidebar() {
    const ownerName = useSelector(getHomeOwnerName);
    const ownerFullName = useSelector(getHomeOwnerFullName);
    const avatar = useSelector(getHomeOwnerAvatar);
    const inHomeProfile = useSelector((state: ClientState) => isAtHomeNode(state) && isInProfilePages(state));
    const atNews = useSelector(isAtNewsPage);
    const newsHref = useHomeNews();
    const inExplore = useSelector(isInExplorePages);
    const atSettings = useSelector(isAtSettingsPage);
    const {t} = useTranslation();

    const MENU_TABS = useMemo<MenuItem[]>(() => [
        {
            value: "news",
            icon: msPublic,
            title: getFeedTitle("news", t),
            href: newsHref,
            active: atNews
        },
        {
            value: "explore",
            icon: msExplore,
            title: t("explore"),
            href: "/explore",
            active: inExplore
        },
        {
            value: "settings",
            icon: msSettings,
            title: t("settings"),
            href: "/settings",
            active: atSettings
        },
    ], [atNews, atSettings, inExplore, newsHref, t]);

    if (!ownerName) {
        return null;
    }

    return (
        <OnlyDesktop>
            <nav id="main-menu-sidebar">
                <ul className="nav nav-pills flex-column">
                    {!inHomeProfile &&
                        <>
                            <li className="nav-item">
                                <Jump className="nav-link" nodeName={REL_HOME} href="/">
                                    <Avatar className="icon" avatar={avatar} ownerName={ownerName} size={24}
                                            nodeName={REL_HOME}/>
                                    {ownerFullName || NodeName.shorten(ownerName)}
                                </Jump>
                            </li>
                            <hr/>
                        </>
                    }
                    {MENU_TABS.map((item, index) => (
                        <li className="nav-item" key={index}>
                            <Jump
                                className={cx("nav-link", {"active": item.active})}
                                nodeName={REL_HOME}
                                href={item.href}
                            >
                                <Icon className="icon" icon={item.icon} size={24}/>
                                {item.title}
                                {item.value === "news" && <NewsCounter/>}
                            </Jump>
                        </li>
                    ))}
                </ul>
            </nav>
        </OnlyDesktop>
    );
}
