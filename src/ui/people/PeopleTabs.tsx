import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

import { ClientState } from "state/state";
import { getNodeFriendGroups, isAtHomeNode } from "state/node/selectors";
import { openFriendGroupAddDialog } from "state/friendgroupadddialog/actions";
import { PeopleTab } from "state/people/state";
import { Tabs } from "ui/control";
import { getFriendGroupTitle } from "ui/control/principal-display";
import { useMediaQuery } from "ui/hook";
import { msGroupAdd, msLock } from "ui/material-symbols";
import { ut } from "util/url";
import "./PeopleTabs.css";

interface PeopleTabsProps {
    active: PeopleTab;
}

export default function PeopleTabs({active}: PeopleTabsProps) {
    const loadedGeneral = useSelector((state: ClientState) => state.people.loadedGeneral);
    const subscribersTotal = useSelector((state: ClientState) => state.people.subscribersTotal);
    const subscriptionsTotal = useSelector((state: ClientState) => state.people.subscriptionsTotal);
    const friendsTotal = useSelector((state: ClientState) => state.people.friendsTotal);
    const friendOfsTotal = useSelector((state: ClientState) => state.people.friendOfsTotal);
    const blockedTotal = useSelector((state: ClientState) => state.people.blockedTotal);
    const blockedByTotal = useSelector((state: ClientState) => state.people.blockedByTotal);
    const viewSubscribers = useSelector((state: ClientState) => state.people.operations.viewSubscribers ?? "public");
    const viewSubscriptions = useSelector((state: ClientState) => state.people.operations.viewSubscriptions ?? "public");
    const viewFriends = useSelector((state: ClientState) => state.people.operations.viewFriends ?? "public");
    const viewFriendOfs = useSelector((state: ClientState) => state.people.operations.viewFriendOfs ?? "public");
    const viewBlocked = useSelector((state: ClientState) => state.people.operations.viewBlocked ?? "public");
    const viewBlockedBy = useSelector((state: ClientState) => state.people.operations.viewBlockedBy ?? "admin");
    const friendGroups = useSelector(getNodeFriendGroups);
    const friendsGroupId = friendGroups.find(fg => fg.title === "t:friends")?.id;
    const inFriendGroup = friendGroups.some(({id}) => id === active);
    const atHome = useSelector(isAtHomeNode);
    const smallScreen = useMediaQuery("(max-width: 1435px)");
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onAdd = () => dispatch(openFriendGroupAddDialog());

    const smallFont = !smallScreen && blockedTotal != null && blockedByTotal != null
        && (t("blocked-plural") + t("blocked-by-plural")).length > 30;

    return (
        <>
            <Tabs<PeopleTab>
                tabs={[
                    {
                        title: t("subscribers"),
                        value: "subscribers",
                        href: "/people/subscribers",
                        visible: subscribersTotal != null,
                        count: loadedGeneral ? subscribersTotal: undefined,
                        principal: viewSubscribers
                    },
                    {
                        title: t("subscriptions"),
                        value: "subscriptions",
                        href: "/people/subscriptions",
                        visible: subscriptionsTotal != null,
                        count: loadedGeneral ? subscriptionsTotal: undefined,
                        principal: viewSubscriptions
                    },
                    {
                        title: t("friend-groups.friends"),
                        value: friendsGroupId ?? "",
                        href: ut`/people/${friendsGroupId ?? ""}`,
                        active: inFriendGroup,
                        visible: friendsTotal != null && friendGroups.length > 0,
                        count: loadedGeneral ? friendsTotal?.[friendsGroupId ?? 0] ?? 0: undefined,
                        principal: viewFriends
                    },
                    {
                        title: t("in-friends"),
                        value: "friend-ofs",
                        href: "/people/friend-ofs",
                        visible: friendOfsTotal != null,
                        count: loadedGeneral ? friendOfsTotal: undefined,
                        principal: viewFriendOfs
                    },
                    {
                        title: t("blocked-plural"),
                        value: "blocked",
                        href: "/people/blocked",
                        visible: blockedTotal != null,
                        count: loadedGeneral ? blockedTotal: undefined,
                        principal: viewBlocked
                    },
                    {
                        title: t("in-blocked-plural"),
                        value: "blocked-by",
                        href: "/people/blocked-by",
                        visible: blockedByTotal != null,
                        count: loadedGeneral ? blockedByTotal: undefined,
                        principal: viewBlockedBy
                    }
                ]}
                tabStyle="pills"
                className={cx("people-tabs", "mb-1", {"small-font": smallFont})}
                scroll={smallScreen ? "always" : "mobile"}
                value={active}
                principalIcons={{"admin": msLock}}
            />
            {inFriendGroup &&
                <Tabs<string>
                    tabs={friendGroups.map(friendGroup => ({
                        title: friendGroup.title !== "t:friends" ? getFriendGroupTitle(friendGroup.title, t) : t("all"),
                        value: friendGroup.id,
                        href: ut`/people/${friendGroup.id}`,
                        count: friendsTotal?.[friendGroup.id] ?? 0,
                        principal: friendGroup.title !== "t:friends"
                            ? friendGroup.operations?.view ?? "public"
                            : "public"
                    }))}
                    className="mt-2 mb-1"
                    scroll={friendGroups.length > 4 || smallScreen ? "always" : "mobile"}
                    value={active}
                    principalIcons={{"admin": msLock}}
                    principalTitles={{
                        "private": t("friend-group-visibility.private"),
                        "admin": t("friend-group-visibility.admin")
                    }}
                    addIcon={atHome ? msGroupAdd : undefined}
                    onAdd={onAdd}
                />
            }
        </>
    );
}
