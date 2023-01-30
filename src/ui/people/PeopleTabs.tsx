import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getNodeFriendGroups } from "state/node/selectors";
import { peopleGoToTab } from "state/people/actions";
import { PeopleTab } from "state/people/state";
import { getFriendGroupTitle } from "ui/control/principal-display";
import PeopleTabsItem from "ui/people/PeopleTabsItem";
import "./PeopleTabs.css";

type PeopleTabsProps = {
    active: PeopleTab;
} & ConnectedProps<typeof connector>;

const PeopleTabs = ({
    active, loadedGeneral, subscribersTotal, subscriptionsTotal, friendsTotal, friendOfsTotal, blockedTotal,
    blockedByTotal, viewSubscribers, viewSubscriptions, viewFriends, viewFriendOfs, viewBlocked, viewBlockedBy,
    friendGroups, peopleGoToTab
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
                friendGroups.map(friendGroup =>
                    <PeopleTabsItem name={friendGroup.id} title={getFriendGroupTitle(friendGroup.title, t)}
                                    principal={viewFriends} total={friendsTotal[friendGroup.id] ?? 0}
                                    loaded={loadedGeneral} active={active} peopleGoToTab={peopleGoToTab}
                                    key={friendGroup.id}/>
                )
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
        friendGroups: getNodeFriendGroups(state)
    }),
    { peopleGoToTab }
);

export default connector(PeopleTabs);
