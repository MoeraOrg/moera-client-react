import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getNodeFriendGroups, isAtHomeNode } from "state/node/selectors";
import { peopleGoToTab } from "state/people/actions";
import { openFriendGroupAddDialog } from "state/friendgroupadddialog/actions";
import { PeopleTab } from "state/people/state";
import { Button } from "ui/control";
import { getFriendGroupTitle } from "ui/control/principal-display";
import PeopleTabsItem from "ui/people/PeopleTabsItem";
import "./PeopleTabs.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type PeopleTabsProps = {
    active: PeopleTab;
} & ConnectedProps<typeof connector>;

const PeopleTabs = ({
    active, loadedGeneral, subscribersTotal, subscriptionsTotal, friendsTotal, friendOfsTotal, blockedTotal,
    blockedByTotal, viewSubscribers, viewSubscriptions, viewFriends, viewFriendOfs, viewBlocked, viewBlockedBy,
    friendGroups, atHome, peopleGoToTab, openFriendGroupAddDialog
}: PeopleTabsProps) => {
    const {t} = useTranslation();

    return (
        <ul className="nav nav-pills flex-md-column people-tabs">
            {subscribersTotal != null &&
                <PeopleTabsItem name="subscribers" title={t("subscribers")} principal={viewSubscribers}
                                total={subscribersTotal} loaded={loadedGeneral} active={active}
                                peopleGoToTab={peopleGoToTab}/>
            }
            {subscriptionsTotal != null &&
                <PeopleTabsItem name="subscriptions" title={t("subscriptions")} principal={viewSubscriptions}
                                total={subscriptionsTotal} loaded={loadedGeneral} active={active}
                                peopleGoToTab={peopleGoToTab}/>
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
                                           active={active} peopleGoToTab={peopleGoToTab} key={friendGroup.id}/>;
                })
            }
            {friendOfsTotal != null &&
                <PeopleTabsItem name="friend-ofs" title={t("in-friends")} principal={viewFriendOfs}
                                total={friendOfsTotal} loaded={loadedGeneral} active={active}
                                peopleGoToTab={peopleGoToTab}/>
            }
            {blockedTotal != null &&
                <PeopleTabsItem name="blocked" title={t("blocked-plural")} principal={viewBlocked}
                                total={blockedTotal} loaded={loadedGeneral} active={active}
                                peopleGoToTab={peopleGoToTab}/>
            }
            {blockedByTotal != null &&
                <PeopleTabsItem name="blocked-by" title={t("in-blocked-plural")} principal={viewBlockedBy}
                                total={blockedByTotal} loaded={loadedGeneral} active={active}
                                peopleGoToTab={peopleGoToTab}/>
            }
            {atHome &&
                <Button variant="outline-info" size="sm" onClick={() => openFriendGroupAddDialog()}>
                    <FontAwesomeIcon icon="plus"/>{" "}{t("add-friend-group")}
                </Button>
            }
        </ul>
    );
}

const connector = connect(
    (state: ClientState) => ({
        loadedGeneral: state.people.loadedGeneral,
        subscribersTotal: state.people.subscribersTotal,
        subscriptionsTotal: state.people.subscriptionsTotal,
        friendsTotal: state.people.friendsTotal,
        friendOfsTotal: state.people.friendOfsTotal,
        blockedTotal: state.people.blockedTotal,
        blockedByTotal: state.people.blockedByTotal,
        viewSubscribers: state.people.operations.viewSubscribers ?? "public",
        viewSubscriptions: state.people.operations.viewSubscriptions ?? "public",
        viewFriends: state.people.operations.viewFriends ?? "public",
        viewFriendOfs: state.people.operations.viewFriendOfs ?? "public",
        viewBlocked: state.people.operations.viewBlocked ?? "public",
        viewBlockedBy: state.people.operations.viewBlockedBy ?? "admin",
        friendGroups: getNodeFriendGroups(state),
        atHome: isAtHomeNode(state)
    }),
    { peopleGoToTab, openFriendGroupAddDialog }
);

export default connector(PeopleTabs);
