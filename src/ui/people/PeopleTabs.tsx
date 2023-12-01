import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ClientState } from "state/state";
import { getNodeFriendGroups, isAtHomeNode } from "state/node/selectors";
import { peopleGoToTab } from "state/people/actions";
import { openFriendGroupAddDialog } from "state/friendgroupadddialog/actions";
import { PeopleTab } from "state/people/state";
import { Button } from "ui/control";
import { getFriendGroupTitle } from "ui/control/principal-display";
import PeopleTabsItem from "ui/people/PeopleTabsItem";
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
    const atHome = useSelector(isAtHomeNode);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const goToTab = (tab: string) => dispatch(peopleGoToTab(tab));

    return (
        <ul className="nav nav-pills flex-md-column people-tabs">
            {subscribersTotal != null &&
                <PeopleTabsItem name="subscribers" title={t("subscribers")} principal={viewSubscribers}
                                total={subscribersTotal} loaded={loadedGeneral} active={active}
                                peopleGoToTab={goToTab}/>
            }
            {subscriptionsTotal != null &&
                <PeopleTabsItem name="subscriptions" title={t("subscriptions")} principal={viewSubscriptions}
                                total={subscriptionsTotal} loaded={loadedGeneral} active={active}
                                peopleGoToTab={goToTab}/>
            }
            {friendsTotal != null &&
                friendGroups.map(friendGroup => {
                    const title = getFriendGroupTitle(friendGroup.title, t);
                    const principal = friendGroup.title !== "t:friends"
                        ? friendGroup.operations?.view ?? "public"
                        : viewFriends;
                    const principalTitles = friendGroup.title !== "t:friends"
                        ? {
                              "private": t("friend-group-visibility.private"),
                              "admin": t("friend-group-visibility.admin")
                          }
                        :
                          null;
                    const total = friendsTotal[friendGroup.id] ?? 0;
                    return <PeopleTabsItem name={friendGroup.id} title={title} principal={principal}
                                           principalTitles={principalTitles} total={total} loaded={loadedGeneral}
                                           active={active} peopleGoToTab={goToTab} key={friendGroup.id}/>;
                })
            }
            {friendOfsTotal != null &&
                <PeopleTabsItem name="friend-ofs" title={t("in-friends")} principal={viewFriendOfs}
                                total={friendOfsTotal} loaded={loadedGeneral} active={active}
                                peopleGoToTab={goToTab}/>
            }
            {blockedTotal != null &&
                <PeopleTabsItem name="blocked" title={t("blocked-plural")} principal={viewBlocked}
                                total={blockedTotal} loaded={loadedGeneral} active={active}
                                peopleGoToTab={goToTab}/>
            }
            {blockedByTotal != null &&
                <PeopleTabsItem name="blocked-by" title={t("in-blocked-plural")} principal={viewBlockedBy}
                                total={blockedByTotal} loaded={loadedGeneral} active={active}
                                peopleGoToTab={goToTab}/>
            }
            {atHome &&
                <Button variant="outline-info" size="sm" onClick={() => dispatch(openFriendGroupAddDialog())}>
                    <FontAwesomeIcon icon="plus"/>{" "}{t("add-friend-group")}
                </Button>
            }
        </ul>
    );
}
